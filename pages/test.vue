<template>
  <div class="space-y-4">
    <button @click="start()" class="btn btn-primary w-full">test et</button>
    <button @click="finish()" class="btn btn-primary w-full">
      test et finish
    </button>

    <div v-if="html" class="mt-4 border rounded overflow-hidden">
      <iframe
        :srcdoc="html"
        style="width: 100%; height: 560px; border: 0"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const html = ref("");
const paymentId = ref("");
const conversationId = ref("ajskfha2131");
const conversationData = ref("");
// Nuxt tarafında:
async function start() {
  const initRes = await $fetch(
    `${config.public.medusaUrl}/store/iyzico/init3ds`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": config.public.medusaPublishableKey || "",
        Authorization: `Bearer ${
          localStorage.getItem("medusa_auth_token") || ""
        }`,
      },
      body: {
        locale: "tr",
        conversationId: "convers41241221ationId213",
        price: 0.3,
        paidPrice: 0.3,
        currency: "TRY",
        installment: 1,
        paymentChannel: "WEB",
        basketId: "basketId",
        paymentGroup: "PRODUCT",
        callbackUrl: "https://www.sacrel.com.tr/payment/callback",
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
    paymentId.value = initRes.paymentId;
    //conversationId.value = initRes.conversationId;
    conversationData.value = initRes.conversationData;
    html.value = atob(initRes.threeDSHtmlContent);
  }
}
async function finish() {
  const authRes = await $fetch(
    `${config.public.medusaUrl}/store/iyzico/auth3ds`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": config.public.medusaPublishableKey || "",
        Authorization: `Bearer ${
          localStorage.getItem("medusa_auth_token") || ""
        }`,
      },
      body: {
        locale: "tr",
        paymentId: paymentId.value,
        conversationId: conversationId.value,
        conversationData: conversationData.value,
      },
    }
  );
}
</script>
