<template>
  <div class="space-y-4 p-4">
    <!-- BIN Check Section -->
    <div class="bg-gray-50 p-4 rounded-lg">
      <h3 class="text-lg font-semibold mb-4">1. BIN Check (Kart Kontrolü)</h3>
      <div class="flex gap-2">
        <input v-model="binNumber" placeholder="Kart numarasının ilk 6 hanesi (BIN)" class="flex-1 p-2 border rounded"
          maxlength="6" />
        <button @click="checkBinNumber()" class="btn btn-secondary">BIN Check</button>
      </div>
      <div v-if="binCheckResult" class="mt-2 p-2 bg-green-100 rounded text-sm">
        <p><strong>Kart Tipi:</strong> {{ binCheckResult.cardType }}</p>
        <p><strong>Kart Markası:</strong> {{ binCheckResult.cardAssociation }}</p>
        <p><strong>Banka:</strong> {{ binCheckResult.bankName }}</p>
        <p><strong>Kart Ailesi:</strong> {{ binCheckResult.cardFamily }}</p>
        <p><strong>Ticari Kart:</strong> {{ binCheckResult.commercial ? 'Evet' : 'Hayır' }}</p>
        <p><strong>3DS Zorunlu:</strong> {{ binCheckResult.force3ds ? 'Evet' : 'Hayır' }}</p>
      </div>
    </div>

    <!-- Payment Card Form -->
    <div class="bg-gray-50 p-4 rounded-lg">
      <h3 class="text-lg font-semibold mb-4">2. Ödeme Bilgileri</h3>
      <div class="grid grid-cols-2 gap-4">
        <input v-model="paymentCard.cardHolderName" placeholder="Kart Sahibi Adı" class="p-2 border rounded" />
        <input v-model="paymentCard.cardNumber" placeholder="Kart Numarası" class="p-2 border rounded" maxlength="16" />
        <input v-model="paymentCard.expireMonth" placeholder="Ay (MM)" class="p-2 border rounded" maxlength="2" />
        <input v-model="paymentCard.expireYear" placeholder="Yıl (YYYY)" class="p-2 border rounded" maxlength="4" />
        <input v-model="paymentCard.cvc" placeholder="CVC" class="p-2 border rounded" maxlength="3" />
        <input v-model="paymentAmount" placeholder="Tutar" class="p-2 border rounded" type="number" step="0.01" />
      </div>
    </div>

    <!-- 3DS Payment Button -->
    <div class="bg-blue-50 p-4 rounded-lg">
      <h3 class="text-lg font-semibold mb-4">3. 3DS Ödeme Başlat</h3>
      <button @click="start()" class="btn btn-primary w-full" :disabled="!canStartPayment">
        3DS Ödeme Başlat
      </button>
      <p v-if="!canStartPayment" class="text-red-500 text-sm mt-2">
        Lütfen önce kart bilgilerini doldurun
      </p>
    </div>

    <!-- 3DS Modal -->
    <div v-if="html" class="fixed top-0 inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0;">
      <div class="bg-white rounded-lg shadow-lg p-0 relative w-full max-w-lg flex flex-col items-center">
        <button @click="html = ''"
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold">&times;</button>
        <iframe :srcdoc="html" style="width: 100%; height: 560px; border: 0" class="rounded-b-lg"></iframe>
      </div>
    </div>

    <!-- Payment Status -->
    <div v-if="paymentStatus" class="p-4 rounded-lg" :class="paymentStatus.success ? 'bg-green-100' : 'bg-red-100'">
      <h3 class="font-semibold">Ödeme Durumu</h3>
      <p>{{ paymentStatus.message }}</p>
      <div v-if="paymentStatus.details" class="text-sm mt-2">
        <p><strong>Payment ID:</strong> {{ paymentStatus.details.paymentId }}</p>
        <p><strong>mdStatus:</strong> {{ paymentStatus.details.mdStatus }}</p>
        <p v-if="paymentStatus.details.authCode"><strong>Auth Code:</strong> {{ paymentStatus.details.authCode }}</p>
        <p v-if="paymentStatus.details.price"><strong>Price:</strong> {{ paymentStatus.details.price }}</p>
      </div>
    </div>

    <!-- Debug Info -->
    <div class="bg-gray-50 p-4 rounded-lg">
      <h3 class="text-lg font-semibold mb-4">Debug Bilgileri</h3>
      <div class="text-sm space-y-1">
        <p><strong>Current URL:</strong> {{ currentUrl || 'N/A' }}</p>
        <p><strong>Callback URL:</strong> {{ `${config.public.medusaUrl || ''}/admin/iyzico/callback3ds` }}</p>
        <p><strong>Conversation ID:</strong> {{ conversationId }}</p>
        <p><strong>Payment ID:</strong> {{ paymentId }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// iyzico 3DS Composable'ı kullan
const { checkBin, processPayment } = useIyzicoPayment();

// Nuxt config'i al
const config = useRuntimeConfig();

// Browser ortamında window objesine erişim
const currentUrl = ref('');

const html = ref("");
const paymentId = ref("");
const conversationId = ref("");
const conversationData = ref("");
const paymentStatus = ref(null);

// BIN Check için
const binNumber = ref("");
const binCheckResult = ref(null);

// Ödeme formu için
const paymentCard = ref({
  cardHolderName: "Dev iyzico",
  cardNumber: "5526080000000006",
  expireMonth: "11",
  expireYear: "2030",
  cvc: "200"
});

const paymentAmount = ref("3.2");

// Buyer bilgileri (gerçek projede bu bilgiler kullanıcıdan alınmalı)
const buyerInfo = ref({
  id: "BY789",
  name: "John",
  surname: "Doe",
  identityNumber: "74300864791",
  email: "email@email.com",
  gsmNumber: "+905350000000",
  registrationDate: "2013-04-21 15:12:09",
  lastLoginDate: "2015-10-05 12:43:35",
  registrationAddress: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
  city: "Istanbul",
  country: "Turkey",
  zipCode: "34732",
  ip: "85.34.78.112"
});

// Computed
const canStartPayment = computed(() => {
  return paymentCard.value.cardHolderName &&
    paymentCard.value.cardNumber &&
    paymentCard.value.expireMonth &&
    paymentCard.value.expireYear &&
    paymentCard.value.cvc &&
    paymentAmount.value;
});

// Kart numarasından BIN numarasını otomatik doldur
watch(() => paymentCard.value.cardNumber, (newCardNumber) => {
  if (newCardNumber && newCardNumber.length >= 6) {
    binNumber.value = newCardNumber.substring(0, 6);
  }
});

// PostMessage listener ekle
onMounted(() => {
  // Browser ortamında çalıştığımızdan emin ol
  if (process.client && typeof window !== 'undefined') {
    currentUrl.value = window.location.href;
    window.addEventListener('message', handleMessage);
  }
});

onUnmounted(() => {
  // Browser ortamında çalıştığımızdan emin ol
  if (process.client && typeof window !== 'undefined') {
    window.removeEventListener('message', handleMessage);
  }
});

function handleMessage(event) {
  console.log('Received message:', event.data);

  if (event.data.type === 'payment_completed') {
    console.log('Payment completed:', event.data);

    // Modal'ı kapat
    html.value = '';

    // Ödeme sonucuna göre işlem yap
    if (event.data.status === 'success') {
      paymentStatus.value = {
        success: true,
        message: 'Ödeme başarıyla tamamlandı!',
        details: {
          paymentId: event.data.paymentId,
          mdStatus: event.data.mdStatus,
          authCode: event.data.authCode,
          price: event.data.price
        }
      };
      console.log('Ödeme başarıyla tamamlandı!');
    } else if (event.data.status === 'failure') {
      paymentStatus.value = {
        success: false,
        message: 'Ödeme başarısız oldu.',
        details: {
          paymentId: event.data.paymentId,
          mdStatus: event.data.mdStatus
        }
      };
      console.log('Ödeme başarısız oldu.');
    }
  } else if (event.data.type === 'close_modal') {
    // Modal'ı kapat
    console.log('Closing modal');
    html.value = '';
  }
}

// 1. BIN Check Fonksiyonu
async function checkBinNumber() {
  if (!binNumber.value || binNumber.value.length !== 6) {
    alert('Lütfen 6 haneli BIN numarası girin');
    return;
  }

  try {
    const result = await checkBin({
      price: paymentAmount.value,
      binNumber: binNumber.value
    });

    if (result.status === "success") {
      binCheckResult.value = result;
      console.log('BIN Check Result:', binCheckResult.value);
    } else {
      alert('BIN check başarısız oldu');
    }
  } catch (error) {
    console.error('BIN Check Error:', error);
    alert('BIN check sırasında hata oluştu');
  }
}

// 2. 3DS Ödeme Başlatma Fonksiyonu
async function start() {
  try {
    paymentStatus.value = null;

    // Basket items oluştur
    const basketItems = [
      {
        id: "BI101",
        price: (parseFloat(paymentAmount.value) / 2).toFixed(2),
        name: "Test Ürün 1",
        category1: "Test",
        category2: "Ürün",
        itemType: "PHYSICAL"
      },
      {
        id: "BI102",
        price: (parseFloat(paymentAmount.value) / 2).toFixed(2),
        name: "Test Ürün 2",
        category1: "Test",
        category2: "Ürün",
        itemType: "PHYSICAL"
      }
    ];

    // Composable kullanarak ödeme işlemini başlat
    const result = await processPayment({
      card: paymentCard.value,
      amount: paymentAmount.value,
      buyer: buyerInfo.value,
      basketItems: basketItems
    });

    if (result.success && result.data) {
      console.log("3DS başlatma başarılı");

      paymentId.value = result.data.paymentId || "";
      conversationId.value = result.data.conversationId || "";
      conversationData.value = result.data.conversationData || "";

      // 3DS HTML içeriğini modal'da göster
      html.value = result.data.threeDSHtml;

      console.log("3DS HTML içeriği modal'da gösteriliyor");
    } else {
      throw new Error(result.error || '3DS başlatma başarısız');
    }
  } catch (error) {
    console.error('3DS Init Error:', error);
    paymentStatus.value = {
      success: false,
      message: `3DS başlatma hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`,
      details: null
    };
  }
}

</script>
