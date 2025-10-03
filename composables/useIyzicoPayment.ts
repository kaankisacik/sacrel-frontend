/**
 * iyzico 3DS Ödeme Sistemi Composable
 * 
 * Bu composable iyzico dokümantasyonuna uygun olarak
 * 3DS ödeme akışını yönetir:
 * 
 * 1. BIN Check
 * 2. 3DS Başlatma  
 * 3. threeDSHtmlContent Decode
 * 4. Yönlendirme
 * 5. 3DS Tamamlama
 * 6. Webhook Doğrulaması
 */

interface BinCheckRequest {
  price: string;
  binNumber: string;
}

interface BinCheckResponse {
  status: string;
  locale: string;
  systemTime: number;
  binNumber: string;
  cardType: string;
  cardAssociation: string;
  cardFamily: string;
  bankName: string;
  bankCode: number;
  commercial: number;
  force3ds?: number;
  forceCvc?: number;
  dccEnabled?: number;
  installmentPrices?: Array<{
    installmentPrice: number;
    totalPrice: number;
    installmentNumber: number;
  }>;
}

interface PaymentCard {
  cardHolderName: string;
  cardNumber: string;
  expireYear: string;
  expireMonth: string;
  cvc: string;
}

interface Buyer {
  id: string;
  name: string;
  surname: string;
  identityNumber: string;
  email: string;
  gsmNumber: string;
  registrationDate: string;
  lastLoginDate: string;
  registrationAddress: string;
  city: string;
  country: string;
  zipCode: string;
  ip?: string;
}

interface Address {
  address: string;
  zipCode: string;
  contactName: string;
  city: string;
  country: string;
}

interface BasketItem {
  id: string;
  price: string;
  name: string;
  category1: string;
  category2?: string;
  itemType: 'PHYSICAL' | 'VIRTUAL';
}

interface Init3DSRequest {
  locale: string;
  price: string;
  paidPrice: string;
  installment: number;
  paymentChannel: string;
  basketId: string;
  paymentGroup: string;
  paymentCard: PaymentCard;
  buyer: Buyer;
  conversationId: string;
  shippingAddress: Address;
  billingAddress: Address;
  basketItems: BasketItem[];
  currency: string;
  callbackUrl: string;
}

interface Init3DSResponse {
  status: string;
  locale: string;
  systemTime: number;
  conversationId: string;
  threeDSHtmlContent: string;
  paymentId?: string;
  conversationData?: string;
  errorMessage?: string;
}


interface Auth3DSRequest {
  locale: string;
  conversationId: string;
  paymentId: string;
  cartId: string;
  conversationData?: string;
}

interface Auth3DSResponse {
  status: string;
  locale: string;
  systemTime: number;
  price: number;
  paidPrice: number;
  installment: number;
  paymentId: string;
  fraudStatus: number;
  merchantCommissionRate: number;
  merchantCommissionRateAmount: number;
  iyziCommissionRateAmount: number;
  iyziCommissionFee: number;
  cardType: string;
  cardAssociation: string;
  cardFamilyName: string;
  binNumber: string;
  lastFourDigits: string;
  basketId: string;
  currency: string;
  authCode: string;
  phase: string;
  mdStatus: number;
  hostReference: string;
  errorMessage?: string;
  medusa: MedusaPaymentData;
}

interface MedusaPaymentData {
  cart_completed: boolean;
  cart_id: string;
  order_id: string;
  payment_captured: boolean;
  payment_session_id: string;
}

interface WebhookData {
  iyziEventTime: number;
  iyziEventType: string;
  iyziReferenceCode: string;
  paymentId: string;
  paymentConversationId: string;
  status: string;
}

export const useIyzicoPayment = () => {
  const config = useRuntimeConfig();

  // API endpoint'leri
  const endpoints = {
    binCheck: `${config.public.medusaUrl}/store/iyzico/bincheck`,
    init3ds: `${config.public.medusaUrl}/store/iyzico/init3ds`,
    auth3ds: `${config.public.medusaUrl}/store/iyzico/auth3ds`,
    callback: `${config.public.medusaUrl}/admin/iyzico/callback3ds`
  };

  // HTTP headers
  const getHeaders = () => ({
    "Content-Type": "application/json",
    "x-publishable-api-key": config.public.medusaPublishableKey || "",
    Authorization: `Bearer ${localStorage.getItem("medusa_auth_token") || ""}`,
  });

  /**
   * 1. BIN Check - Kart bilgilerini kontrol eder
   */
  const checkBin = async (request: BinCheckRequest): Promise<BinCheckResponse> => {
    try {
      const response = await $fetch(endpoints.binCheck, {
        method: "POST",
        headers: getHeaders(),
        body: request,
      });

      return response as BinCheckResponse;
    } catch (error) {
      console.error('BIN Check Error:', error);
      throw error;
    }
  };

  /**
   * 2. 3DS Başlatma - 3DS ödeme sürecini başlatır
   */
  const init3DS = async (request: Init3DSRequest): Promise<Init3DSResponse> => {
    try {
      const response = await $fetch(endpoints.init3ds, {
        method: "POST",
        headers: getHeaders(),
        body: request,
      });

      return response as Init3DSResponse;
    } catch (error) {
      console.error('3DS Init Error:', error);
      throw error;
    }
  };

  /**
   * 3. threeDSHtmlContent Decode - Base64 şifreli HTML'i çözer
   */
  const decodeThreeDSHtml = (threeDSHtmlContent: string): string => {
    try {
      return atob(threeDSHtmlContent);
    } catch (error) {
      console.error('3DS HTML Decode Error:', error);
      throw new Error('3DS HTML içeriği decode edilemedi');
    }
  };

  /**
   * 5. 3DS Tamamlama - Ödeme işlemini tamamlar
   */
  const auth3DS = async (request: Auth3DSRequest): Promise<Auth3DSResponse> => {
    try {
      const response = await $fetch(endpoints.auth3ds, {
        method: "POST",
        headers: getHeaders(),
        body: request,
      });

      return response as Auth3DSResponse;
    } catch (error) {
      console.error('3DS Auth Error:', error);
      throw error;
    }
  };

  /**
   * Ödeme parametrelerini doğrular (Webhook doğrulaması için)
   */
  const validatePayment = (authResponse: Auth3DSResponse, callbackData: any): boolean => {
    try {
      // paymentId kontrolü
      if (authResponse.paymentId !== callbackData.paymentId) {
        console.error("PaymentId mismatch:", authResponse.paymentId, "vs", callbackData.paymentId);
        return false;
      }

      // status kontrolü
      if (authResponse.status !== "success") {
        console.error("Auth response status is not success:", authResponse.status);
        return false;
      }

      // mdStatus kontrolü (3DS için)
      if (String(authResponse.mdStatus) !== "1") {
        console.error("mdStatus is not 1:", authResponse.mdStatus);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Payment validation error:", error);
      return false;
    }
  };

  /**
   * mdStatus'e göre hata mesajları (dokümantasyondan)
   */
  const getMdStatusMessage = (mdStatus: string | number): string => {
    const statusMessages: Record<string, string> = {
      '0': '3-D Secure imzası geçersiz veya doğrulama hatası',
      '-1': '3-D Secure imzası geçersiz (QNB Finansbank)',
      '2': 'Kart sahibi veya bankası sisteme kayıtlı değil',
      '3': 'Kartın bankası sisteme kayıtlı değil',
      '4': 'Doğrulama denemesi, kart sahibi sisteme daha sonra kayıt olmayı seçmiş',
      '5': 'Doğrulama yapılamıyor',
      '6': '3-D Secure hatası',
      '7': 'Sistem hatası',
      '8': 'Bilinmeyen kart no'
    };
    
    return statusMessages[String(mdStatus)] || `Bilinmeyen mdStatus: ${mdStatus}`;
  };

  /**
   * Tam 3DS ödeme akışı
   */
  const processPayment = async (paymentData: {
    card: PaymentCard;
    amount: string;
    buyer: Buyer;
    basketItems: BasketItem[];
  }) => {
    try {
      // 1. BIN Check (opsiyonel)
      const binNumber = paymentData.card.cardNumber.substring(0, 6);
      const binResult = await checkBin({
        price: paymentData.amount,
        binNumber: binNumber
      });

      console.log('BIN Check Result:', binResult);

      // 2. 3DS Başlatma
      const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const init3DSRequest: Init3DSRequest = {
        locale: "tr",
        price: paymentData.amount,
        paidPrice: paymentData.amount,
        installment: 1,
        paymentChannel: "WEB",
        basketId: `B${Date.now()}`,
        paymentGroup: "PRODUCT",
        paymentCard: paymentData.card,
        buyer: paymentData.buyer,
        conversationId: conversationId,
        shippingAddress: {
          address: paymentData.buyer.registrationAddress,
          zipCode: paymentData.buyer.zipCode,
          contactName: `${paymentData.buyer.name} ${paymentData.buyer.surname}`,
          city: paymentData.buyer.city,
          country: paymentData.buyer.country
        },
        billingAddress: {
          address: paymentData.buyer.registrationAddress,
          zipCode: paymentData.buyer.zipCode,
          contactName: `${paymentData.buyer.name} ${paymentData.buyer.surname}`,
          city: paymentData.buyer.city,
          country: paymentData.buyer.country
        },
        basketItems: paymentData.basketItems,
        currency: "TRY",
        callbackUrl: endpoints.callback
      };

      const init3DSResponse = await init3DS(init3DSRequest);

      if (init3DSResponse.status === "success" && init3DSResponse.threeDSHtmlContent) {
        // 3. threeDSHtmlContent Decode
        const decodedHtml = decodeThreeDSHtml(init3DSResponse.threeDSHtmlContent);
        
        return {
          success: true,
          data: {
            paymentId: init3DSResponse.paymentId,
            conversationId: init3DSResponse.conversationId,
            conversationData: init3DSResponse.conversationData,
            threeDSHtml: decodedHtml,
            binInfo: binResult
          }
        };
      } else {
        throw new Error(init3DSResponse.errorMessage || '3DS başlatma başarısız');
      }

    } catch (error) {
      console.error('Payment Process Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Ödeme işlemi başarısız'
      };
    }
  };

  return {
    // API Functions
    checkBin,
    init3DS,
    auth3DS,
    
    // Utility Functions
    decodeThreeDSHtml,
    validatePayment,
    getMdStatusMessage,
    
    // Complete Flow
    processPayment
  };
};