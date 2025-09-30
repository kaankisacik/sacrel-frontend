<template>
  <div class="space-y-4 p-4">
    <div class="bg-yellow-100 p-4 rounded">
      <p>{{ status }}</p>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const route = useRoute();
const status = ref('Başlatılıyor...');
const fullUrl = ref('');

async function finish() {
  try {
    // Log all parameters received
    console.log('=== PAYMENT CALLBACK DEBUG ===');
    console.log('Full URL:', window.location.href);
    console.log('Route Query:', route.query);
    console.log('Route Params:', route.params);
    console.log('PaymentId:', route.query.paymentId);
    console.log('ConversationId:', route.query.conversationId);
    console.log('All URL params:', new URLSearchParams(window.location.search));

    status.value = 'Ödeme doğrulaması işleniyor...';

    const authRes = await $fetch(
      `${config.public.medusaUrl}/store/iyzico/auth3ds`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": config.public.medusaPublishableKey || "",
          Authorization: `Bearer ${localStorage.getItem("medusa_auth_token") || ""
            }`,
        },
        body: {
          locale: "tr",
          conversationId: route.query.conversationId
        },
      }
    );

    console.log('Auth3DS Response:', authRes);

    if (authRes.status != "success" && authRes.status != "failure") {
      console.log("finish status is neither success nor failure");
      status.value = 'Geçersiz yanıt durumu - kapanıyor';
      
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'close_modal' }, '*');
      } else {
        setTimeout(() => window.close(), 2000);
      }
      return;
    }

    if (authRes.status === "error") {
      console.log("finish status is error");
      status.value = 'Ödeme hatası - kapanıyor';
      
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'close_modal' }, '*');
      } else {
        setTimeout(() => window.close(), 2000);
      }
      return;
    }

    if (authRes.status == "success") {
      console.log("finish status is success");
      status.value = 'Ödeme başarılı!';
      alert("Ödeme başarıyla tamamlandı");

      // Parent window'a mesaj gönder
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ 
          type: 'payment_completed', 
          status: 'success',
          paymentId: route.query.paymentId,
          conversationId: route.query.conversationId
        }, '*');
      }

      //close the window
      setTimeout(() => {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'close_modal' }, '*');
        } else {
          window.close();
        }
      }, 2000);

    } else if (authRes.status == "failure") {
      console.log("finish status is failure");
      status.value = 'Ödeme başarısız';
      alert("Ödeme başarısız.");
      
      // Parent window'a mesaj gönder
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ 
          type: 'payment_completed', 
          status: 'failure',
          paymentId: route.query.paymentId,
          conversationId: route.query.conversationId
        }, '*');
      }

      setTimeout(() => {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'close_modal' }, '*');
        } else {
          window.close();
        }
      }, 2000);
    }
  } catch (error) {
    console.log("=== PAYMENT CALLBACK ERROR ===");
    console.log("finish error in auth3ds");
    console.log('Error details:', error);
    console.log('Error message:', error.message);
    console.log('Error response:', error.response);

    status.value = `Hata: ${error.message || 'Bilinmeyen hata'}`;

    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'close_modal' }, '*');
    } else {
      setTimeout(() => window.close(), 2000);
    }
    return;
  }
}

onMounted(async () => {
  // Set the full URL for display
  // fullUrl.value = window.location.href;

  // Log mount information
  console.log('=== CALLBACK PAGE MOUNTED ===');
  console.log('Current URL:', window.location.href);
  console.log('Search params:', window.location.search);
  console.log('Route query on mount:', route.query);
  console.log('Route params on mount:', route.params);
  await new Promise(resolve => setTimeout(resolve, 300));
  finish();
});
</script>