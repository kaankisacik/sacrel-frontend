<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center space-x-4">
          <NuxtLink to="/cart" class="text-gray-600 hover:text-black">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </NuxtLink>
          <h1 class="text-2xl font-bold text-gray-900">Ödeme</h1>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Empty Cart Redirect -->
      <div v-if="cartStore.isEmpty" class="text-center py-12">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Sepetiniz boş</h2>
        <p class="text-gray-600 mb-6">Ödeme yapmak için sepetinizde ürün olmalıdır.</p>
        <NuxtLink to="/products"
          class="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition duration-300">
          Alışverişe Başla
        </NuxtLink>
      </div>

      <!-- Checkout Form -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left Column - Forms -->
        <div class="space-y-6">
          <!-- Customer Information -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">İletişim Bilgileri</h2>
            <div class="space-y-4">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                <input id="email" v-model="customerInfo.email" type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                  placeholder="ornek@email.com" required />
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                  <input id="firstName" v-model="customerInfo.first_name" type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                    required />
                </div>
                <div>
                  <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                  <input id="lastName" v-model="customerInfo.last_name" type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                    required />
                </div>
              </div>
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input id="phone" v-model="customerInfo.phone" type="tel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                  placeholder="+90 5XX XXX XX XX" />
              </div>
            </div>
          </div>

          <!-- Shipping Address -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-start justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Teslimat Adresi</h2>
              <div class="flex items-center space-x-2">
                <p>
                  Adresim farklı
                </p>
                <div class="relative inline-block w-11 h-5">
                  <input id="switch-component" type="checkbox" v-model="isUserWantsToAddAddress"
                    class="peer appearance-none w-11 h-5 bg-slate-100 rounded-full checked:bg-slate-800 cursor-pointer transition-colors duration-300" />
                  <label for="switch-component"
                    class="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer">

                  </label>
                </div>
              </div>
            </div>
            <div v-if="addresses.length > 0 && !isUserWantsToAddAddress" class="mb-4">
              <label for="addressSelect" class="block text-sm font-medium text-gray-700 mb-1">Adres Seçin</label>
              <select id="addressSelect" v-model="shippingAddress"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black">
                <template v-for="address in addresses" :key="address.id">
                  <option :value="address">{{ address.address_1 }}, {{ address.city }}</option>
                </template>
              </select>
            </div>

            <div v-if="addresses.length === 0 || isUserWantsToAddAddress" class="space-y-4">
              <div>
                <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                <textarea id="address" v-model="shippingAddress.address_1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                  rows="3" placeholder="Mahalle, sokak, kapı no" required></textarea>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="city" class="block text-sm font-medium text-gray-700 mb-1">İl</label>
                  <input id="city" v-model="shippingAddress.city" type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                    required />
                </div>
                <div>
                  <label for="district" class="block text-sm font-medium text-gray-700 mb-1">İlçe</label>
                  <input id="district" v-model="shippingAddress.metadata.district" type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                    required />
                </div>
                <div>
                  <label for="postalCode" class="block text-sm font-medium text-gray-700 mb-1">Posta Kodu</label>
                  <input id="postalCode" v-model="shippingAddress.postal_code" type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                    required />
                </div>
              </div>
              <!-- <div>
                <label for="country" class="block text-sm font-medium text-gray-700 mb-1">Ülke</label>
                <select
                  id="country"
                  v-model="shippingAddress.country_code"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                  required
                >
                  <option value="tr">Türkiye</option>
                </select>
              </div> -->
            </div>
          </div>

          <!-- Payment Method -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Ödeme Yöntemi</h2>
            
            <!-- Payment Method Selection -->
            <div class="space-y-3 mb-6">
              <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50" :class="{ 'border-black bg-gray-50': paymentMethod === 'credit_card' }">
                <input v-model="paymentMethod" type="radio" value="credit_card" class="text-black focus:ring-black" />
                <span class="ml-3 font-medium">Kredi Kartı</span>
              </label>
              <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50" :class="{ 'border-black bg-gray-50': paymentMethod === 'bank_transfer' }">
                <input v-model="paymentMethod" type="radio" value="bank_transfer" class="text-black focus:ring-black" />
                <span class="ml-3 font-medium">Banka Havalesi</span>
              </label>
              <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50" :class="{ 'border-black bg-gray-50': paymentMethod === 'cash_on_delivery' }">
                <input v-model="paymentMethod" type="radio" value="cash_on_delivery" class="text-black focus:ring-black" />
                <span class="ml-3 font-medium">Kapıda Ödeme</span>
              </label>
            </div>

            <!-- Payment Method Components -->
            <div v-if="paymentMethod" class="border-t pt-6">
              <CreditCardPayment 
                v-if="paymentMethod === 'credit_card'"
                v-model="paymentData.creditCard"
                @validate="handlePaymentValidation"
              />
              
              <BankTransferPayment 
                v-if="paymentMethod === 'bank_transfer'"
                :order-total="cartStore.cart.total"
                :order-reference="generateOrderReference()"
                @validate="handlePaymentValidation"
              />
              
              <CashOnDeliveryPayment 
                v-if="paymentMethod === 'cash_on_delivery'"
                :order-total="cartStore.cart.total"
                :extra-fee="codExtraFee"
                @validate="handlePaymentValidation"
                @update:payment-option="handleCodPaymentOption"
              />
            </div>
          </div>
        </div>

        <!-- Right Column - Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Sipariş Özeti</h2>

            <!-- Order Items -->
            <div class="space-y-3 mb-6">
              <div v-for="item in cartStore.cart.items" :key="item.id" class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img :src="item.thumbnail || '/images/placeholder.jpg'" :alt="item.title"
                    class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ item.title }}</p>
                  <p class="text-xs text-gray-600">{{ item.variant_title }}</p>
                  <p class="text-sm text-gray-600">{{ item.quantity }} adet</p>
                </div>
                <div class="text-sm font-medium text-gray-900">
                  {{ formatPrice(item.unit_price * item.quantity) }}
                </div>
              </div>
            </div>

            <!-- Price Breakdown -->
            <div class="space-y-2 mb-6 border-t pt-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Ara Toplam:</span>
                <span class="text-gray-900">{{ formatPrice(cartStore.cart.subtotal) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">KDV:</span>
                <span class="text-gray-900">{{ formatPrice(cartStore.cart.tax_total || 0) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Kargo:</span>
                <span class="text-gray-900">{{ formatPrice(cartStore.cart.shipping_total || 0) }}</span>
              </div>
              <div v-if="paymentMethod === 'cash_on_delivery' && codExtraFee > 0" class="flex justify-between text-sm">
                <span class="text-gray-600">Kapıda Ödeme Ücreti:</span>
                <span class="text-gray-900">{{ formatPrice(codExtraFee) }}</span>
              </div>
              <div class="border-t pt-2">
                <div class="flex justify-between text-lg font-semibold">
                  <span class="text-gray-900">Toplam:</span>
                  <span class="text-gray-900">{{ formatPrice(finalTotal) }}</span>
                </div>
              </div>
            </div>

            <!-- Complete Order Button -->
            <button @click="completeOrder" :disabled="!isFormValid || isProcessing"
              class="w-full bg-black text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isProcessing ? 'Sipariş Veriliyor...' : getOrderButtonText() }}
            </button>

            <!-- Security Notice -->
            <div class="mt-4 p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
                <span class="text-xs text-gray-600">Güvenli ödeme ile korunuyorsunuz</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

// SEO
useHead({
  title: 'Ödeme - Sacrel',
  meta: [
    { name: 'description', content: 'Siparişinizi tamamlayın ve güvenli ödeme yapın.' }
  ]
})

const cartStore = useCartStore()
const router = useRouter()
const authStore = useAuthStore()
const customer = computed(() => authStore.customer)
const addresses = computed(() => authStore.addresses)

console.log("checkout page mounted, addresses:", addresses.value || []);
console.log("checkout page mounted, customer:", customer.value);

const simulateAsyncOperation = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
   if (customer.value && customer.value.email) {
    console.log("aaa2:", customer.value);

    customerInfo.value.email = customer.value.email
    customerInfo.value.first_name = customer.value.first_name || ''
    customerInfo.value.last_name = customer.value.last_name || ''
    customerInfo.value.phone = customer.value.phone || ''
  }

  if (addresses.value && addresses.value.length > 0) {
    shippingAddress.value = addresses.value[0]
  } else {
    shippingAddress.value = {
      address_1: '',
      city: '',
      metadata: { district: '' },
      postal_code: '',
      country_code: 'tr'
    }
  }
};

simulateAsyncOperation();


// Form data
const customerInfo = ref({
  email: '',
  first_name: '',
  last_name: '',
  phone: ''
})

const shippingAddress = ref({
  address_1: '',
  city: '',
  metadata: {},
  postal_code: '',
  country_code: 'tr'
})

const paymentMethod = ref('credit_card')
const isProcessing = ref(false)
const isUserWantsToAddAddress = ref(false)
const isPaymentValid = ref(false)
const codExtraFee = ref(500) // 5 TL kapıda ödeme ücreti
const codPaymentOption = ref('cash')

// Payment data for different methods
const paymentData = ref({
  creditCard: {},
  bankTransfer: {},
  cashOnDelivery: {}
})
// Computed properties
const isFormValid = computed(() => {
  return (
    customerInfo.value.email &&
    customerInfo.value.first_name &&
    customerInfo.value.last_name &&
    shippingAddress.value.address_1 &&
    shippingAddress.value.city &&
    shippingAddress.value.postal_code &&
    paymentMethod.value &&
    isPaymentValid.value
  )
})

const finalTotal = computed(() => {
  let total = cartStore.cart.total || 0
  if (paymentMethod.value === 'cash_on_delivery') {
    total += codExtraFee.value
  }
  return total
})

// Helper functions
const formatPrice = (amount) => {
  if (!amount) return '0 TL'
  return `${(amount / 100).toLocaleString('tr-TR')} TL`
}

const generateOrderReference = () => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
}

const getOrderButtonText = () => {
  switch (paymentMethod.value) {
    case 'credit_card':
      return 'Kartla Öde'
    case 'bank_transfer':
      return 'Sipariş Ver (Havale)'
    case 'cash_on_delivery':
      return 'Kapıda Öde'
    default:
      return 'Siparişi Tamamla'
  }
}

const handlePaymentValidation = (isValid) => {
  isPaymentValid.value = isValid
}

const handleCodPaymentOption = (option) => {
  codPaymentOption.value = option
}

// Reset payment validation when payment method changes
watch(paymentMethod, () => {
  isPaymentValid.value = false
})

const completeOrder = async () => {
  if (!isFormValid.value || isProcessing.value) return

  isProcessing.value = true

  try {
    // Ödeme yöntemine göre farklı işlemler
    const orderData = {
      customer: customerInfo.value,
      shipping_address: shippingAddress.value,
      payment_method: paymentMethod.value,
      payment_data: paymentData.value[paymentMethod.value] || {},
      total: finalTotal.value,
      items: cartStore.cart.items
    }

    console.log('Order data:', orderData)

    // Bu noktada gerçek Medusa checkout API'leri kullanılacak
    // Şimdilik basit bir simülasyon yapıyoruz

    if (paymentMethod.value === 'credit_card') {
      // Kredi kartı ödeme işlemi
      console.log('Processing credit card payment...', paymentData.value.creditCard)
    } else if (paymentMethod.value === 'bank_transfer') {
      // Banka havalesi için sipariş oluştur
      console.log('Creating order for bank transfer...')
    } else if (paymentMethod.value === 'cash_on_delivery') {
      // Kapıda ödeme için sipariş oluştur
      console.log('Creating COD order...', codPaymentOption.value)
    }

    // Simulated order completion
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Success - redirect to order confirmation
    router.push('/order/success')

  } catch (error) {
    console.error('Error completing order:', error)
    alert('Sipariş tamamlanırken bir hata oluştu. Lütfen tekrar deneyin.')
  } finally {
    isProcessing.value = false
  }
}

// Initialize cart and redirect if empty
onMounted(() => {
  if (!cartStore.cart) {
    cartStore.initCart()
  }
})

// Redirect to cart if empty
watchEffect(() => {
  if (cartStore.isEmpty && !cartStore.isLoading) {
    router.push('/cart')
  }
})
</script>
