<template>
  <div class="space-y-4">
    <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
      <div class="flex items-start space-x-3">
        <svg class="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <div class="flex-1">
          <h3 class="text-sm font-medium text-green-800">Kapıda Ödeme</h3>
          <p class="text-sm text-green-700 mt-1">
            Siparişiniz teslim edilirken nakit veya kredi kartı ile ödeme yapabilirsiniz.
          </p>
        </div>
      </div>
    </div>

    <div class="bg-white border border-gray-200 rounded-lg p-4">
      <h4 class="font-medium text-gray-900 mb-3">Ödeme Seçenekleri</h4>
      
      <div class="space-y-3">
        <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
          <input 
            v-model="selectedPaymentOption" 
            type="radio" 
            value="cash" 
            class="text-black focus:ring-black"
          />
          <div class="ml-3 flex-1">
            <div class="flex items-center justify-between">
              <span class="font-medium text-gray-900">Nakit</span>
              <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 6h-2l-1.44-1.44A1 1 0 0 0 16.84 4H7.16a1 1 0 0 0-.72.56L5 6H3a1 1 0 0 0 0 2h18a1 1 0 0 0 0-2zM12 13a3 3 0 1 0-3-3 3 3 0 0 0 3 3z"/>
              </svg>
            </div>
            <p class="text-sm text-gray-600 mt-1">Kargo görevlisine nakit ödeme</p>
          </div>
        </label>

        <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
          <input 
            v-model="selectedPaymentOption" 
            type="radio" 
            value="pos" 
            class="text-black focus:ring-black"
          />
          <div class="ml-3 flex-1">
            <div class="flex items-center justify-between">
              <span class="font-medium text-gray-900">POS ile Kart Ödemesi</span>
              <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
              </svg>
            </div>
            <p class="text-sm text-gray-600 mt-1">Kargo görevlisinin POS cihazı ile kredi/banka kartı ödemesi</p>
          </div>
        </label>
      </div>
    </div>

    <!-- Ek Ücret Bilgisi -->
    <div v-if="extraFee > 0" class="p-3 bg-amber-50 border border-amber-200 rounded-lg">
      <div class="flex items-center space-x-2">
        <svg class="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
        </svg>
        <span class="text-sm text-amber-800">
          Kapıda ödeme için {{ formatPrice(extraFee) }} ek ücret alınmaktadır.
        </span>
      </div>
    </div>

    <!-- Teslimat Bilgileri -->
    <div class="bg-gray-50 p-4 rounded-lg">
      <h5 class="font-medium text-gray-900 mb-2">Teslimat Bilgileri:</h5>
      <ul class="text-sm text-gray-600 space-y-1">
        <li class="flex items-start">
          <span class="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
          Teslimat sırasında kimlik ibraz etmeniz gerekebilir
        </li>
        <li class="flex items-start">
          <span class="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
          POS ödemesi için PIN kodunuzu bilmeniz gerekir
        </li>
        <li class="flex items-start">
          <span class="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
          Ürünleri teslim almadan önce kontrol edebilirsiniz
        </li>
      </ul>
    </div>

    <!-- Onay Checkbox -->
    <div class="flex items-start space-x-3 mt-4">
      <input 
        id="codAgreement" 
        v-model="agreementAccepted" 
        type="checkbox"
        class="text-black focus:ring-black border-gray-300 rounded mt-1"
        required
      />
      <label for="codAgreement" class="text-sm text-gray-700">
        Kapıda ödeme koşullarını okudum ve kabul ediyorum. Teslimat sırasında ödeme yapmayı taahhüt ediyorum.
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
  extraFee: {
    type: Number,
    default: 500 // 5 TL ek ücret
  }
})

const emit = defineEmits(['validate', 'update:paymentOption'])

const selectedPaymentOption = ref('cash')
const agreementAccepted = ref(false)

// Form validasyonu
const isValid = computed(() => {
  return selectedPaymentOption.value && agreementAccepted.value
})

// Helper function
const formatPrice = (amount) => {
  if (!amount) return '0 TL'
  return `${(amount / 100).toLocaleString('tr-TR')} TL`
}

// Değişiklikleri parent'a gönder
watch([selectedPaymentOption, agreementAccepted], () => {
  emit('validate', isValid.value)
  emit('update:paymentOption', selectedPaymentOption.value)
}, { immediate: true })

// Bileşen yüklendiğinde validation durumunu gönder
onMounted(() => {
  emit('validate', isValid.value)
  emit('update:paymentOption', selectedPaymentOption.value)
})
</script>
