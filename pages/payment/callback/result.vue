<template>
  <div class="space-y-4 p-4">
    <div class="bg-yellow-100 p-4 rounded">
      <p>{{ status }}</p>
    </div>
    
    <!-- Debug bilgileri -->
    <div v-if="debugMode" class="bg-gray-100 p-4 rounded mt-4">
      <h3 class="font-bold mb-2">Debug Bilgileri:</h3>
      <div class="text-sm space-y-1">
        <p><strong>Status:</strong> {{ callbackData.status }}</p>
        <p><strong>PaymentId:</strong> {{ callbackData.paymentId }}</p>
        <p><strong>ConversationData:</strong> {{ callbackData.conversationData }}</p>
        <p><strong>ConversationId:</strong> {{ callbackData.conversationId }}</p>
        <p><strong>mdStatus:</strong> {{ callbackData.mdStatus }}</p>
        <p><strong>URL:</strong> {{ fullUrl }}</p>
        <p><strong>Query Params:</strong> {{ JSON.stringify(route.query) }}</p>
        <p><strong>Timestamp:</strong> {{ new Date().toISOString() }}</p>
      </div>
    </div>
    
    <!-- Loading spinner -->
    <div v-if="isProcessing" class="flex justify-center p-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const route = useRoute();
const status = ref('Ödeme sonucu kontrol ediliyor...');
const fullUrl = ref('');
const debugMode = ref(true);
const isProcessing = ref(true);

// iyzico callback parametreleri
const callbackData = ref({
  status: '',
  paymentId: '',
  conversationData: '',
  conversationId: '',
  mdStatus: ''
});

// Component mounted olduğunda parametreleri al ve işle
onMounted(async () => {
  fullUrl.value = window.location.href;
  
  console.log('=== PAYMENT CALLBACK DEBUG ===');
  console.log('Current URL:', window.location.href);
  console.log('Route query:', route.query);
  console.log('Route params:', route.params);
  
  // URL parametrelerinden callback verilerini al
  callbackData.value = {
    status: String(route.query.status || ''),
    paymentId: String(route.query.paymentId || ''),
    conversationData: String(route.query.conversationData || ''),
    conversationId: String(route.query.conversationId || ''),
    mdStatus: String(route.query.mdStatus || '')
  };
  
  console.log('Callback Data:', callbackData.value);
  
  // Kısa bir gecikme sonra işlemi başlat
  await new Promise(resolve => setTimeout(resolve, 500));
  
  finish();
});

async function finish() {
  try {
    isProcessing.value = true;
    status.value = 'Ödeme sonucu işleniyor...';
    
    console.log('=== PROCESSING CALLBACK ===');
    console.log('Callback Data:', callbackData.value);

    // Status kontrolü
    if (!callbackData.value.status) {
      console.log("No status parameter received");
      status.value = 'Geçersiz callback - status parametresi bulunamadı';
      isProcessing.value = false;
      closeWindow();
      return;
    }

    // mdStatus kontrolü - dokümantasyona göre başarılı işlemler için 1 olmalı
    if (callbackData.value.status === 'success') {
      if (callbackData.value.mdStatus !== '1') {
        console.log("Success status but mdStatus is not 1:", callbackData.value.mdStatus);
        status.value = `3DS doğrulama başarısız (mdStatus: ${callbackData.value.mdStatus})`;
        handlePaymentFailure();
        return;
      }

      // Başarılı ödeme durumu
      if (!callbackData.value.paymentId) {
        console.log("Success status but no paymentId");
        status.value = 'Başarılı ödeme ancak paymentId bulunamadı';
        isProcessing.value = false;
        closeWindow();
        return;
      }

      status.value = 'Ödeme doğrulaması işleniyor...';

      // 5. 3DS Tamamlama isteği gönder
      const authBody = {
        locale: "tr",
        conversationId: callbackData.value.conversationId,
        paymentId: callbackData.value.paymentId
      };

      // conversationData varsa ekle
      if (callbackData.value.conversationData) {
        authBody.conversationData = callbackData.value.conversationData;
      }

      const authRes = await $fetch(
        `${config.public.medusaUrl}/store/iyzico/auth3ds`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": config.public.medusaPublishableKey || "",
            Authorization: `Bearer ${localStorage.getItem("medusa_auth_token") || ""}`,
          },
          body: authBody,
        }
      );

      console.log('Auth3DS Response:', authRes);

      // Dokümantasyona göre doğrulama
      if (authRes.status === "success") {
        console.log("Payment completed successfully");
        
        // Webhook ile doğrulama parametreleri
        const isValidPayment = validatePaymentParameters(authRes, callbackData.value);
        
        if (isValidPayment) {
          status.value = 'Ödeme başarıyla tamamlandı!';
          isProcessing.value = false;
          
          // Parent window'a başarı mesajı gönder
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({ 
              type: 'payment_completed', 
              status: 'success',
              paymentId: callbackData.value.paymentId,
              conversationId: callbackData.value.conversationId,
              mdStatus: callbackData.value.mdStatus,
              authCode: authRes.authCode,
              price: authRes.price
            }, '*');
          }

          setTimeout(() => closeWindow(), 2000);
        } else {
          console.log("Payment validation failed");
          status.value = 'Ödeme doğrulama başarısız - güvenlik kontrolü';
          handlePaymentFailure();
        }

      } else {
        console.log("Auth3DS failed:", authRes);
        status.value = `Ödeme doğrulama başarısız: ${authRes.errorMessage || 'Bilinmeyen hata'}`;
        handlePaymentFailure();
      }

    } else if (callbackData.value.status === 'failure') {
      // Başarısız ödeme durumu
      console.log("Payment failed - status: failure");
      
      // mdStatus'e göre hata mesajı
      const errorMessage = getMdStatusMessage(callbackData.value.mdStatus);
      status.value = `Ödeme başarısız: ${errorMessage}`;
      handlePaymentFailure();

    } else {
      // Bilinmeyen durum
      console.log("Unknown payment status:", callbackData.value.status);
      status.value = `Bilinmeyen ödeme durumu: ${callbackData.value.status}`;
      isProcessing.value = false;
      closeWindow();
    }

  } catch (error) {
    console.log("=== PAYMENT CALLBACK ERROR ===");
    console.log("Error in finish function");
    console.log('Error details:', error);
    console.log('Error message:', error.message);
    console.log('Error response:', error.response);

    status.value = `Hata: ${error.message || 'Bilinmeyen hata'}`;
    isProcessing.value = false;
    closeWindow();
  }
}

// Dokümantasyona göre ödeme doğrulama fonksiyonu
function validatePaymentParameters(authResponse, callbackData) {
  try {
    // paymentId kontrolü
    if (authResponse.paymentId !== callbackData.paymentId) {
      console.log("PaymentId mismatch:", authResponse.paymentId, "vs", callbackData.paymentId);
      return false;
    }

    // status kontrolü
    if (authResponse.status !== "success") {
      console.log("Auth response status is not success:", authResponse.status);
      return false;
    }

    // mdStatus kontrolü (3DS için)
    if (String(authResponse.mdStatus) !== "1") {
      console.log("mdStatus is not 1:", authResponse.mdStatus);
      return false;
    }

    console.log("Payment validation successful");
    return true;
  } catch (error) {
    console.log("Payment validation error:", error);
    return false;
  }
}

// mdStatus'e göre hata mesajları (dokümantasyondan)
function getMdStatusMessage(mdStatus) {
  const statusMessages = {
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
  
  return statusMessages[mdStatus] || `Bilinmeyen mdStatus: ${mdStatus}`;
}

function handlePaymentFailure() {
  isProcessing.value = false;
  
  // Parent window'a başarısızlık mesajı gönder
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ 
      type: 'payment_completed', 
      status: 'failure',
      paymentId: callbackData.value.paymentId,
      conversationId: callbackData.value.conversationId,
      mdStatus: callbackData.value.mdStatus
    }, '*');
  }

  setTimeout(() => closeWindow(), 3000);
}

function closeWindow() {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'close_modal' }, '*');
  } else {
    setTimeout(() => window.close(), 1000);
  }
}
</script>