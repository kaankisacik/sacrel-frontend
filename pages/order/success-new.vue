<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div class="text-center">
          <!-- Success Icon -->
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          
          <!-- Success Message -->
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            Siparişiniz Alındı!
          </h2>
          
          <p class="text-gray-600 mb-6">
            Siparişiniz başarıyla oluşturuldu. Kısa süre içinde e-posta adresinize onay mesajı göndereceğiz.
          </p>
          
          <!-- Order Info -->
          <div v-if="orderData" class="bg-gray-50 rounded-lg p-4 mb-6">
            <div class="text-sm text-gray-600">
              <p class="font-medium">Sipariş Numarası:</p>
              <p class="text-lg font-bold text-gray-900">#{{ orderData.display_id }}</p>
            </div>
            <div class="mt-2 text-sm text-gray-600">
              <p class="font-medium">Toplam Tutar:</p>
              <p class="text-lg font-bold text-gray-900">{{ formatPrice(orderData.total) }}</p>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="space-y-3">
            <NuxtLink
              to="/orders"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Siparişlerimi Görüntüle
            </NuxtLink>
            
            <NuxtLink
              to="/products"
              class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Alışverişe Devam Et
            </NuxtLink>
            
            <NuxtLink
              to="/"
              class="w-full flex justify-center py-2 px-4 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Ana Sayfaya Dön
            </NuxtLink>
          </div>
          
          <!-- Additional Info -->
          <div class="mt-8 text-xs text-gray-500">
            <p>
              Sipariş durumunuzu e-posta ile takip edebilir veya 
              <NuxtLink to="/profile" class="text-indigo-600 hover:text-indigo-500">profil sayfanızdan</NuxtLink>
              kontrol edebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const route = useRoute()
const cartStore = useCartStore()

// Get order data from route query or store
const orderData = ref(null)

onMounted(() => {
  // Clear cart after successful order
  if (cartStore.cart) {
    cartStore.cart = null
    if (process.client) {
      localStorage.removeItem('cart_id')
    }
  }
  
  // You could also fetch order details if order ID is in route
  if (route.query.order_id) {
    console.log('Order ID:', route.query.order_id)
  }
  
  // Mock order data for demo
  if (route.query.total) {
    orderData.value = {
      display_id: route.query.order_id || '1001',
      total: parseInt(route.query.total) || 0
    }
  }
})

// Utility function
const formatPrice = (price) => {
  return `${(price / 100).toLocaleString('tr-TR')} TL`
}
</script>
