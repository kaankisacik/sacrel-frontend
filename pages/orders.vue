<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="max-w-4xl mx-auto">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Siparişlerim</h1>
        <p class="mt-2 text-gray-600">Verdiğiniz siparişleri ve durumlarını buradan takip edebilirsiniz</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Siparişler yükleniyor...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-600 mb-4">
          <Icon name="heroicons:exclamation-triangle" class="h-12 w-12 mx-auto" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Bir hata oluştu</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button
          @click="loadOrders"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Tekrar Dene
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="orders.length === 0" class="text-center py-12">
        <Icon name="heroicons:shopping-bag" class="h-24 w-24 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Henüz siparişiniz bulunmuyor</h3>
        <p class="text-gray-600 mb-6">İlk siparişinizi vermek için alışverişe başlayın.</p>
        <NuxtLink
          to="/products"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Alışverişe Başla
        </NuxtLink>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-6">
        <div
          v-for="order in orders"
          :key="order.id"
          class="bg-white shadow overflow-hidden sm:rounded-lg"
        >
          <!-- Order Header -->
          <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Sipariş #{{ order.display_id }}
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                  {{ formatDate(order.created_at) }} tarihinde verildi
                </p>
              </div>
              <div class="text-right">
                <p class="text-lg font-semibold text-gray-900">
                  {{ formatPrice(order.total) }}
                </p>
                <span
                  :class="getOrderStatusClass(order.status)"
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                >
                  {{ getOrderStatusText(order.status) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Order Details -->
          <div class="px-4 py-5 sm:px-6">
            <!-- Order Items -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Sipariş İçeriği</h4>
              <div class="space-y-3">
                <div
                  v-for="item in order.items"
                  :key="item.id"
                  class="flex items-center space-x-4"
                >
                  <div class="flex-shrink-0 w-16 h-16">
                    <img
                      :src="item.thumbnail || '/images/placeholder.jpg'"
                      :alt="item.title"
                      class="w-full h-full object-cover rounded-md"
                    >
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900">{{ item.title }}</p>
                    <p v-if="item.variant?.title" class="text-sm text-gray-500">{{ item.variant.title }}</p>
                    <p class="text-sm text-gray-500">Adet: {{ item.quantity }}</p>
                  </div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ formatPrice(item.total) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Shipping Address -->
            <div v-if="order.shipping_address" class="mb-6">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Teslimat Adresi</h4>
              <div class="text-sm text-gray-600">
                <p>{{ order.shipping_address.first_name }} {{ order.shipping_address.last_name }}</p>
                <p>{{ order.shipping_address.address_1 }}</p>
                <p v-if="order.shipping_address.address_2">{{ order.shipping_address.address_2 }}</p>
                <p>{{ order.shipping_address.city }}, {{ order.shipping_address.province }} {{ order.shipping_address.postal_code }}</p>
                <p v-if="order.shipping_address.phone">Tel: {{ order.shipping_address.phone }}</p>
              </div>
            </div>

            <!-- Order Summary -->
            <div class="border-t pt-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Ara Toplam:</span>
                <span class="text-gray-900">{{ formatPrice(order.subtotal) }}</span>
              </div>
              <div v-if="order.shipping_total > 0" class="flex justify-between text-sm mt-1">
                <span class="text-gray-600">Kargo:</span>
                <span class="text-gray-900">{{ formatPrice(order.shipping_total) }}</span>
              </div>
              <div v-if="order.tax_total > 0" class="flex justify-between text-sm mt-1">
                <span class="text-gray-600">KDV:</span>
                <span class="text-gray-900">{{ formatPrice(order.tax_total) }}</span>
              </div>
              <div class="flex justify-between text-base font-medium mt-2 pt-2 border-t">
                <span class="text-gray-900">Toplam:</span>
                <span class="text-gray-900">{{ formatPrice(order.total) }}</span>
              </div>
            </div>

            <!-- Order Actions -->
            <div class="flex justify-end space-x-3 mt-6">
              <button
                v-if="canCancelOrder(order)"
                @click="cancelOrder(order.id)"
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Siparişi İptal Et
              </button>
              <button
                @click="reorderItems(order)"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Tekrar Sipariş Ver
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="hasMore && orders.length > 0" class="text-center mt-8">
        <button
          @click="loadMoreOrders"
          :disabled="loading"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          <span v-if="loading">Yükleniyor...</span>
          <span v-else>Daha Fazla Göster</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'

definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const cartStore = useCartStore()

// State
const loading = ref(false)
const error = ref(null)
const orders = ref([])
const currentPage = ref(1)
const hasMore = ref(true)
const pageSize = 10

// Load orders on mount
onMounted(() => {
  loadOrders()
})

// Methods
const loadOrders = async (page = 1) => {
  loading.value = true
  error.value = null
  
  try {
    const result = await authStore.getOrders()
    
    if (result.success) {
      if (page === 1) {
        orders.value = result.orders
      } else {
        orders.value.push(...result.orders)
      }
      
      hasMore.value = result.orders.length === pageSize
      currentPage.value = page
    } else {
      error.value = result.error || 'Siparişler yüklenemedi'
    }
  } catch (err) {
    error.value = 'Bir hata oluştu'
    console.error('Error loading orders:', err)
  } finally {
    loading.value = false
  }
}

const loadMoreOrders = () => {
  loadOrders(currentPage.value + 1)
}

const cancelOrder = async (orderId) => {
  if (!confirm('Bu siparişi iptal etmek istediğinizden emin misiniz?')) {
    return
  }
  
  try {
    // Bu işlevsellik backend'de implementasyon gerektirir
    console.log('Cancelling order:', orderId)
    // await cancelOrderAPI(orderId)
    // loadOrders() // Refresh orders
  } catch (err) {
    console.error('Error cancelling order:', err)
  }
}

const reorderItems = async (order) => {
  try {
    // Siparişteki tüm ürünleri sepete ekle
    for (const item of order.items) {
      if (item.variant_id) {
        await cartStore.addItem(item.variant_id, item.quantity)
      }
    }
    
    // Sepet sayfasına yönlendir
    await navigateTo('/cart')
  } catch (err) {
    console.error('Error reordering items:', err)
  }
}

// Utility functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price) => {
  return `${(price / 100).toLocaleString('tr-TR')} TL`
}

const getOrderStatusText = (status) => {
  const statusMap = {
    pending: 'Beklemede',
    confirmed: 'Onaylandı',
    processing: 'Hazırlanıyor',
    shipped: 'Kargoda',
    delivered: 'Teslim Edildi',
    cancelled: 'İptal Edildi',
    returned: 'İade Edildi'
  }
  return statusMap[status] || status
}

const getOrderStatusClass = (status) => {
  const classMap = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-orange-100 text-orange-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    returned: 'bg-gray-100 text-gray-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

const canCancelOrder = (order) => {
  return ['pending', 'confirmed'].includes(order.status)
}
</script>
