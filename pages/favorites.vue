<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Page Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">Favorilerim</h1>
            <p class="mt-2 text-gray-600">Beğendiğiniz ürünleri buradan takip edebilirsiniz</p>
        </div>

        <!-- Empty State -->
        <div v-if="favorites.length === 0" class="text-center py-12">
            <Icon name="heroicons:heart" class="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">Henüz favori ürününüz bulunmuyor</h3>
            <p class="text-gray-600 mb-6">Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca
                bulabilirsiniz.</p>
            <NuxtLink to="/products"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Ürünleri Keşfet
            </NuxtLink>
        </div>

        <!-- Favorites Grid -->
        <div v-else>
            <!-- Action Bar -->
            <div class="flex justify-between items-center mb-6">
                <p class="text-sm text-gray-600">
                    {{ favoriteCount }} ürün favorilerinizde
                </p>
                <button v-if="favorites.length > 0" @click="clearAllFavorites"
                    class="text-sm text-red-600 hover:text-red-700 font-medium">
                    Tümünü Temizle
                </button>
            </div>

            <!-- Products Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div v-for="product in favorites" :key="product.id"
                    class="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <!-- Product Image -->
                    <div class="aspect-square overflow-hidden bg-gray-100">
                        <img :src="product.thumbnail || '/images/placeholder.jpg'" :alt="product.title"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            @click="navigateToProduct(product.id)">

                        <!-- Remove from Favorites Button -->
                        <button @click="removeFromFavorites(product.id)"
                            class="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
                            title="Favorilerden çıkar">
                            <Icon name="heroicons:heart-solid" class="h-5 w-5 text-red-500" />
                        </button>
                    </div>

                    <!-- Product Info -->
                    <div class="p-4">
                        <div class="mb-2">
                            <h3 class="text-sm font-medium text-gray-900 hover:text-indigo-600 cursor-pointer line-clamp-2"
                                @click="navigateToProduct(product.id)">
                                {{ product.title }}
                            </h3>
                            <p v-if="product.subtitle" class="text-xs text-gray-500 mt-1">{{ product.subtitle }}
                            </p>
                        </div>

                        <div class="flex items-center justify-between">
                            <p class="text-lg font-semibold text-gray-900">
                                {{ formatPrice(product.price) }}
                            </p>
                            <p class="text-xs text-gray-500">
                                {{ formatDate(product.created_at) }}
                            </p>
                        </div>

                        <!-- Action Buttons -->
                        <div class="mt-4 flex space-x-2">
                            <button @click="addToCart(product)" :disabled="isAddingToCart"
                                class="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                <span v-if="isAddingToCart">Ekleniyor...</span>
                                <span v-else>Sepete Ekle</span>
                            </button>
                            <button @click="navigateToProduct(product.id)"
                                class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                Görüntüle
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Success/Error Messages -->
        <div v-if="message"
            :class="messageType === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'"
            class="fixed bottom-4 right-4 p-4 border rounded-md shadow-lg z-50">
            {{ message }}
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFavoritesStore } from '~/stores/favorites'
import { useCartStore } from '~/stores/cart'

const favoritesStore = useFavoritesStore()
const cartStore = useCartStore()
const router = useRouter()

// State
const isAddingToCart = ref(false)
const message = ref('')
const messageType = ref('success')

// Computed
const favorites = computed(() => favoritesStore.getFavoriteProducts)
const favoriteCount = computed(() => favoritesStore.favoriteCount)

// Initialize favorites on mount
onMounted(() => {
    favoritesStore.init()
})

// Methods
const removeFromFavorites = async (productId) => {
    const result = await favoritesStore.removeFromFavorites(productId)
    showMessage(result.message, result.success ? 'success' : 'error')
}

const clearAllFavorites = async () => {
    if (confirm('Tüm favorileri temizlemek istediğinizden emin misiniz?')) {
        const result = await favoritesStore.clearFavorites()
        showMessage(result.message, result.success ? 'success' : 'error')
    }
}

const addToCart = async (product) => {
    if (!product.variant_id) {
        showMessage('Bu ürün için varyant bulunamadı', 'error')
        return
    }

    isAddingToCart.value = true

    try {
        await cartStore.addItem(product.variant_id, 1)
        showMessage('Ürün sepete eklendi', 'success')
    } catch (error) {
        showMessage('Ürün sepete eklenirken bir hata oluştu', 'error')
    } finally {
        isAddingToCart.value = false
    }
}

const navigateToProduct = (productId) => {
    router.push(`/products/${productId}`)
}

const showMessage = (text, type = 'success') => {
    message.value = text
    messageType.value = type

    setTimeout(() => {
        message.value = ''
    }, 3000)
}

// Utility functions
const formatPrice = (price) => {
    return `${(price / 100).toLocaleString('tr-TR')} TL`
}

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR')
}
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>