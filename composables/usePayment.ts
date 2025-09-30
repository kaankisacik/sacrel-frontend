export interface PaymentCard {
  cardHolderName: string;
  cardNumber: string;
  expireYear: string;
  expireMonth: string;
  cvc: string;
  registerCard: number;
}

export interface Buyer {
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
  ip: string;
}

export interface Address {
  address: string;
  contactName: string;
  city: string;
  country: string;
  zipCode: string;
}

export interface BasketItem {
  id: string;
  price: number;
  name: string;
  category1: string;
  category2: string;
  itemType: string;
}

export interface PaymentInitRequest {
  locale: string;
  conversationId: string;
  price: number;
  paidPrice: number;
  currency: string;
  installment: number;
  paymentChannel: string;
  basketId: string;
  paymentGroup: string;
  callbackUrl: string;
  paymentCard: PaymentCard;
  buyer: Buyer;
  shippingAddress: Address;
  billingAddress: Address;
  basketItems: BasketItem[];
}

export interface PaymentInitResponse {
  status: string;
  paymentId: string;
  conversationId: string;
  conversationData: string;
  threeDSHtmlContent: string;
}

export interface PaymentAuthRequest {
  locale: string;
  paymentId: string;
  conversationId: string;
  conversationData: string;
}

export const usePayment = () => {
  const config = useRuntimeConfig();
  
  const html = ref("");
  const paymentId = ref("");
  const conversationId = ref("");
  const conversationData = ref("");
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "x-publishable-api-key": config.public.medusaPublishableKey || "",
    Authorization: `Bearer ${localStorage.getItem("medusa_auth_token") || ""}`,
  });

  const initPayment = async (paymentData: PaymentInitRequest) => {
    try {
      isLoading.value = true;
      error.value = null;

      const initRes = await $fetch<PaymentInitResponse>(
        `${config.public.medusaUrl}/store/iyzico/init3ds`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: paymentData,
        }
      );

      if (initRes?.status === "success" && initRes?.threeDSHtmlContent) {
        paymentId.value = initRes.paymentId;
        conversationId.value = initRes.conversationId;
        conversationData.value = initRes.conversationData;
        html.value = atob(initRes.threeDSHtmlContent);
        return initRes;
      } else {
        throw new Error("Payment initialization failed");
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Payment initialization failed";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const finishPayment = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const authData: PaymentAuthRequest = {
        locale: "tr",
        paymentId: paymentId.value,
        conversationId: conversationId.value,
        conversationData: conversationData.value,
      };

      const authRes = await $fetch(
        `${config.public.medusaUrl}/store/iyzico/auth3ds`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: authData,
        }
      );

      return authRes;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Payment authentication failed";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const resetPayment = () => {
    html.value = "";
    paymentId.value = "";
    conversationId.value = "";
    conversationData.value = "";
    error.value = null;
  };

  return {
    // State
    html: readonly(html),
    paymentId: readonly(paymentId),
    conversationId: readonly(conversationId),
    conversationData: readonly(conversationData),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Methods
    initPayment,
    finishPayment,
    resetPayment,
  };
};