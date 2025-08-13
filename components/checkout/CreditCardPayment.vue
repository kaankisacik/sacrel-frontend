<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 gap-4">
      <div>
        <label for="cardNumber" class="block text-sm font-medium text-gray-700 mb-1">Kart Numarası</label>
        <input 
          id="cardNumber" 
          v-model="cardInfo.number" 
          type="text"
          maxlength="19"
          placeholder="1234 5678 9012 3456"
          @input="formatCardNumber"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
          required 
        />
      </div>
      
      <div>
        <label for="cardHolder" class="block text-sm font-medium text-gray-700 mb-1">Kart Sahibi</label>
        <input 
          id="cardHolder" 
          v-model="cardInfo.holder_name" 
          type="text"
          placeholder="Ad Soyad"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
          required 
        />
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="expiryDate" class="block text-sm font-medium text-gray-700 mb-1">Son Kullanma</label>
          <input 
            id="expiryDate" 
            v-model="cardInfo.expiry_date" 
            type="text"
            maxlength="5"
            placeholder="MM/YY"
            @input="formatExpiryDate"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
            required 
          />
        </div>
        
        <div>
          <label for="cvv" class="block text-sm font-medium text-gray-700 mb-1">CVV</label>
          <input 
            id="cvv" 
            v-model="cardInfo.cvv" 
            type="text"
            maxlength="4"
            placeholder="123"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
            required 
          />
        </div>
      </div>
      
      <div class="flex items-center">
        <input 
          id="saveCard" 
          v-model="cardInfo.save_card" 
          type="checkbox"
          class="text-black focus:ring-black border-gray-300 rounded"
        />
        <label for="saveCard" class="ml-2 text-sm text-gray-700">Kartımı kaydet</label>
      </div>
    </div>
    
    <!-- Güvenlik Bilgisi -->
    <div class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <div class="flex items-center space-x-2">
        <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <span class="text-xs text-blue-700">256-bit SSL şifreleme ile güvenli ödeme</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'validate'])

const cardInfo = ref({
  number: '',
  holder_name: '',
  expiry_date: '',
  cvv: '',
  save_card: false
})

// Format kart numarası
const formatCardNumber = (event) => {
  let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '')
  let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value
  cardInfo.value.number = formattedValue
}

// Format son kullanma tarihi
const formatExpiryDate = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4)
  }
  cardInfo.value.expiry_date = value
}

// Form validasyonu
const isValid = computed(() => {
  return (
    cardInfo.value.number.replace(/\s/g, '').length >= 16 &&
    cardInfo.value.holder_name.length > 0 &&
    cardInfo.value.expiry_date.length === 5 &&
    cardInfo.value.cvv.length >= 3
  )
})

// Değişiklikleri parent'a gönder
watch(cardInfo, (newValue) => {
  emit('update:modelValue', newValue)
  emit('validate', isValid.value)
}, { deep: true })

// Props'tan gelen değerleri set et
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    cardInfo.value = { ...cardInfo.value, ...newValue }
  }
}, { immediate: true })
</script>
