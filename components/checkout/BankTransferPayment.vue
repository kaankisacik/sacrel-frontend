<template>
  <div class="space-y-4">
    <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div class="flex items-start space-x-3">
        <svg class="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <div class="flex-1">
          <h3 class="text-sm font-medium text-yellow-800">Banka Havalesi Bilgileri</h3>
          <p class="text-sm text-yellow-700 mt-1">
            Sipariş tamamlandıktan sonra banka bilgileri e-posta adresinize gönderilecektir.
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4">
      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 mb-3">Banka Hesap Bilgileri</h4>
        
        <div class="space-y-3">
          <div class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-sm text-gray-600">Banka:</span>
            <span class="text-sm font-medium text-gray-900">Türkiye İş Bankası</span>
          </div>
          
          <div class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-sm text-gray-600">Hesap Sahibi:</span>
            <span class="text-sm font-medium text-gray-900">Sacrel Tekstil Ltd. Şti.</span>
          </div>
          
          <div class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-sm text-gray-600">IBAN:</span>
            <span class="text-sm font-medium text-gray-900 font-mono">TR64 0006 4000 0011 2345 6789 01</span>
          </div>
          
          <div class="flex justify-between py-2">
            <span class="text-sm text-gray-600">Açıklama:</span>
            <span class="text-sm font-medium text-gray-900">Sipariş No: #{{ orderReference }}</span>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 p-4 rounded-lg">
        <h5 class="font-medium text-gray-900 mb-2">Önemli Notlar:</h5>
        <ul class="text-sm text-gray-600 space-y-1">
          <li class="flex items-start">
            <span class="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
            Havale yaparken açıklama kısmına mutlaka sipariş numaranızı yazınız
          </li>
          <li class="flex items-start">
            <span class="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
            Ödeme onayı 1-2 iş günü içinde kontrol edilir
          </li>
          <li class="flex items-start">
            <span class="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
            Ödeme alındıktan sonra siparişiniz hazırlanmaya başlar
          </li>
        </ul>
      </div>
    </div>

    <!-- Onay Checkbox -->
    <div class="flex items-start space-x-3 mt-4">
      <input 
        id="bankTransferAgreement" 
        v-model="agreementAccepted" 
        type="checkbox"
        class="text-black focus:ring-black border-gray-300 rounded mt-1"
        required
      />
      <label for="bankTransferAgreement" class="text-sm text-gray-700">
        Banka havalesi ile ödeme yapacağımı ve yukarıdaki bilgileri okuduğumu onaylıyorum.
      </label>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  orderTotal: {
    type: Number,
    default: 0
  },
  orderReference: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['validate'])

const agreementAccepted = ref(false)

// Form validasyonu
const isValid = computed(() => {
  return agreementAccepted.value
})

// Değişiklikleri parent'a gönder
watch(agreementAccepted, () => {
  emit('validate', isValid.value)
})

// Bileşen yüklendiğinde validation durumunu gönder
onMounted(() => {
  emit('validate', isValid.value)
})
</script>
