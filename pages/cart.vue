<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-gray-900">Sepetim</h1>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p class="text-gray-600">Sepet yükleniyor...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="hasError" class="text-center py-12">
        <div class="w-24 h-24 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <svg class="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Sepet yüklenemedi</h3>
        <p class="text-gray-600 mb-4">{{ error || 'Bir hata oluştu, lütfen tekrar deneyin.' }}</p>
        <button @click="retryLoad"
          class="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-300">
          Tekrar Dene
        </button>
      </div>

      <!-- Empty Cart -->
      <div v-else-if="isEmpty" class="text-center py-12">
        <div class="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 9H6L5 9z" />
          </svg>
        </div>
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">Sepetiniz boş</h2>
        <p class="text-gray-600 mb-6">Sepetinizde ürün bulunmamaktadır.</p>
        <NuxtLink to="/products"
          class="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition duration-300">
          Alışverişe Başla
        </NuxtLink>
      </div>

      <!-- Cart Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-4">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="px-6 py-4 bg-gray-50 border-b">
              <h2 class="text-lg font-semibold text-gray-900">Sepetinizdeki Ürünler ({{ itemCount }})</h2>
            </div>

            <div class="divide-y divide-gray-200">
              <div v-for="item in cartItems" :key="item.id"
                class="p-6 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <!-- Product Image -->
                <div class="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                  <img :src="item.lineItem.thumbnail" :alt="item.lineItem.product_title" class="w-full h-full object-cover" />
                </div>

                <!-- Product Info -->
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg font-medium text-gray-900 mb-1">{{ item.lineItem.product_title }}</h3>
                  <p class="text-sm text-gray-600 mb-2">{{ item.lineItem.variant_title }}</p>
                  <p class="text-lg font-semibold text-gray-900">{{ item.price }}</p>
                </div>

                <!-- Quantity Controls -->
                <div class="flex items-center space-x-3">
                  <button @click="decreaseQuantity(item)" :disabled="item.quantity <= 1 || isLoading"
                    class="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    -
                  </button>
                  <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
                  <button @click="increaseQuantity(item)"
                    :disabled="item.quantity >= getVariantsMaxQuantity[item.lineItem.variant_id] || isLoading"
                    class="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    +
                  </button>
                </div>

                <!-- Item Total -->
                <div class="text-right">
                  <p class="text-lg font-semibold text-gray-900">{{ item.total }}</p>
                  <button @click="removeItem(item)" :disabled="isLoading"
                    class="text-sm text-red-600 hover:text-red-800 disabled:opacity-50">
                    Kaldır
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Sipariş Özeti</h2>

            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Ara Toplam:</span>
                <span class="text-gray-900">{{ subtotal }}</span>
              </div>

              <!-- <div class="flex justify-between text-sm">
                <span class="text-gray-600">KDV:</span>
                <span class="text-gray-900">{{ tax }} TL</span>
              </div> -->

              <div class="border-t pt-3">
                <div class="flex justify-between text-lg font-semibold">
                  <span class="text-gray-900">Toplam:</span>
                  <span class="text-gray-900">{{ total }}</span>
                </div>
              </div>
            </div>

            <!-- Checkout Button -->
            <button @click="proceedToCheckout" :disabled="isLoading || isEmpty"
              class="w-full bg-black text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isLoading ? 'Yükleniyor...' : 'Ödemeye Geç' }}
            </button>

            <!-- Continue Shopping -->
            <NuxtLink to="/products"
              class="block w-full text-center border border-gray-300 text-gray-900 py-3 px-4 rounded-md font-medium hover:bg-gray-50 transition duration-300 mt-3">
              Alışverişe Devam Et
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Page meta
useHead({
  title: 'Sepetim - E-commerce',
  meta: [
    { name: 'description', content: 'Sepetinizdeki ürünleri görüntüleyin ve ödemeye geçin.' }
  ]
})

// Store references
const cartStore = useCartStore()
const productStore = useProductStore()
const { cart, isLoading, error } = storeToRefs(cartStore)
const getVariantsMaxQuantity = computed(() => {
  var variantMap = {}
  cart.value?.cart?.items.forEach(item => {
    console.log("getVariantsMaxQuantity:", item);
    
    if (item.variant_id) {
      variantMap[item.variant_id] = 0
    }
  })
  var a =cartHelper.getVariantsMaxQuantity(productStore.products?.products || [], variantMap);
  console.log("a:", a);
  
  return a
})
// Reactive data
const hasError = ref(false)

// Computed properties
const isEmpty = computed(() => {
  return !cart.value || !cart.value.cart?.items || cart.value.cart.items.length === 0
})

const cartItems = computed(() => {
  if (!cart.value?.cart?.items) return []
  var a = cart.value.cart.items.map(item => cartHelper.formatCartItem(item));
  console.log("cartItems:", a);
  
  return a;
})

const itemCount = computed(() => {
  if (!cart.value?.cart?.items) return 0
  return cartHelper.getItemCount(cart.value.cart.items)
})

const subtotalAmount = computed(() => {
  if (!cart.value?.cart?.items) return 0
  return cartHelper.calculateSubtotal(cart.value.cart.items)
})

const subtotal = computed(() => {
  return checkoutHelper.formatPrice(subtotalAmount.value)
})







const totalAmount = computed(() => {
  return cartHelper.calculateTotal(subtotalAmount.value,0,0)
})

const total = computed(() => {
  return checkoutHelper.formatPrice(totalAmount.value)
})

// Methods
const increaseQuantity = async (item) => {
  try {
    const newQuantity = item.quantity + 1
    console.log("bb1",item,item.lineItem.variant_id);

    if (newQuantity <= getVariantsMaxQuantity.value[item.lineItem.variant_id]) {
      console.log("bb2");
      
      await cartStore.updateCartItem(item.lineItem.id, newQuantity)
    }
  } catch (err) {
    console.error('Failed to increase quantity:', err)
    hasError.value = true
  }
}

const decreaseQuantity = async (item) => {
  try {
    console.log("item:", item);
    
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1
      await cartStore.updateCartItem(item.lineItem.id, newQuantity)
    }
  } catch (err) {
    console.error('Failed to decrease quantity:', err)
    hasError.value = true
  }
}

const removeItem = async (item) => {
  if (confirm('Bu ürünü sepetten çıkarmak istediğinizden emin misiniz?')) {
    try {
      await cartStore.removeFromCart(item.lineItem.id)
    } catch (err) {
      console.error('Failed to remove item:', err)
      hasError.value = true
    }
  }
}

const retryLoad = async () => {
  hasError.value = false
  try {
    await cartStore.initializeCart()
  } catch (err) {
    hasError.value = true
  }
}

const proceedToCheckout = () => {
  navigateTo('/checkout')
}

// Load cart on component mount
onMounted(async () => {
  try {
    await cartStore.initializeCart()
  } catch (err) {
    hasError.value = true
  }
})

// Watch for errors
watch(error, (newError) => {
  if (newError) {
    hasError.value = true
  }
})
</script>