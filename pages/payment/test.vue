<template>
  <div class="space-y-4">
    <button @click="start()" class="btn btn-primary w-full">test et</button>

    <div v-if="html" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-lg p-0 relative w-full max-w-2xl flex flex-col items-center">
        <button @click="html = ''"
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold">&times;</button>
        <iframe :srcdoc="html" style="width: 100%; height: 560px; border: 0" class="rounded-b-lg"></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const html = ref("");
const paymentId = ref("213213123213");
const conversationId = ref("convers41241221ationId213");
const conversationData = ref("");

// PostMessage listener ekle
onMounted(() => {
  window.addEventListener('message', handleMessage);
});

onUnmounted(() => {
  window.removeEventListener('message', handleMessage);
});

function handleMessage(event) {
  console.log('Received message:', event.data);
  
  if (event.data.type === 'payment_completed') {
    console.log('Payment completed:', event.data);
    
    // Modal'ı kapat
    html.value = '';
    
    // Ödeme sonucuna göre işlem yap
    if (event.data.status === 'success') {
      // Başarılı ödeme işlemleri
      console.log('Ödeme başarıyla tamamlandı!');
      // Sayfayı yenile veya başka işlemler yapabilirsiniz
    } else if (event.data.status === 'failure') {
      // Başarısız ödeme işlemleri
      console.log('Ödeme başarısız oldu.');
    }
  } else if (event.data.type === 'close_modal') {
    // Modal'ı kapat
    console.log('Closing modal');
    html.value = '';
  }
}
// Nuxt tarafında:
async function start() {
  const initRes = await $fetch(
    `${config.public.medusaUrl}/store/iyzico/init3ds`,
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
        conversationId: conversationId.value,
        price: 0.3,
        paidPrice: 0.3,
        currency: "TRY",
        installment: 1,
        paymentChannel: "WEB",
        basketId: "basketId",
        paymentGroup: "PRODUCT",
        callbackUrl: "http://localhost:3000/payment/callback/q?conversationId=" + conversationId.value + "&paymentId=" + paymentId.value,
        paymentCard: {
          cardHolderName: "John Doe",
          cardNumber: "5528790000000008",
          expireYear: "28",
          expireMonth: "12",
          cvc: "123",
          registerCard: 0,
        },
        buyer: {
          id: "1",
          name: "John",
          surname: "Doe",
          identityNumber: "74300864791",
          email: "email@email.com",
          gsmNumber: "+905350000000",
          registrationDate: "2013-04-21 15:12:09",
          lastLoginDate: "2015-10-05 12:43:35",
          registrationAddress:
            "Altunizade Mah. İnci Çıkmazı Sokak No: 3 İç Kapı No: 10 Üsküdar İstanbul",
          city: "Istanbul",
          country: "Turkey",
          zipCode: "34000",
          ip: "85.34.78.112",
        },
        shippingAddress: {
          address:
            "Altunizade Mah. İnci Çıkmazı Sokak No: 3 İç Kapı No: 10 Üsküdar İstanbul",
          contactName: "Jane Doe",
          city: "Istanbul",
          country: "Turkey",
          zipCode: "34000",
        },
        billingAddress: {
          address:
            "Altunizade Mah. İnci Çıkmazı Sokak No: 3 İç Kapı No: 10 Üsküdar İstanbul",
          contactName: "Jane Doe",
          city: "Istanbul",
          country: "Turkey",
          zipCode: "34000",
        },
        basketItems: [
          {
            id: "BI103",
            price: 0.3,
            name: "Medusa",
            category1: "Elbise",
            category2: "Accessories",
            itemType: "PHYSICAL",
          },
        ],
      },
    }
  );


  // threeDSHtmlContent base64 HTML
  if (initRes?.status === "success" && initRes?.threeDSHtmlContent) {
    console.log(" initRes: start -> ");

    paymentId.value = initRes.paymentId;
    conversationId.value = initRes.conversationId;
    conversationData.value = initRes.conversationData;
    html.value = atob(initRes.threeDSHtmlContent);

    console.log(" initRes: end -> ");
  }
}

</script>
