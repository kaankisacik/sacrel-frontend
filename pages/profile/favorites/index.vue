<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Page Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">Favorilerim</h1>
            <p class="mt-2 text-gray-600">Beğendiğiniz ürünleri buradan takip edebilirsiniz</p>
        </div>

        <!-- Empty State -->
        <div v-if="!isLoading && favorites.length === 0" class="text-center py-12">
            <div class="h-24 w-24 text-gray-300 mx-auto mb-4 flex items-center justify-center">
                <svg class="h-full w-full" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Henüz favori ürününüz bulunmuyor</h3>
            <p class="text-gray-600 mb-6">
                Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca bulabilirsiniz.
            </p>
            <button @click="navigateToProducts"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Ürünleri Keşfet
            </button>
        </div>

        <!-- Loading State -->
        <div v-else-if="isLoading" class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p class="mt-4 text-gray-600">Favoriler yükleniyor...</p>
        </div>

        <!-- Favorites Grid -->
        <div v-else-if="!isLoading && favorites.length > 0">
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
                        <img :src="product.thumbnail || '/images/placeholder.svg'" :alt="product.title"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                            @click="navigateToProduct(product.id)">

                        <!-- Remove from Favorites Button -->
                        <button @click="removeFromFavorites(product.id)"
                            class="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
                            title="Favorilerden çıkar">
                            <svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                        </button>
                    </div>

                    <!-- Product Info -->
                    <div class="p-4">
                        <div class="mb-2">
                            <h3 class="text-sm font-medium text-gray-900 hover:text-indigo-600 cursor-pointer line-clamp-2"
                                @click="navigateToProduct(product.id)">
                                {{ product.title }}
                            </h3>
                            <p v-if="product.subtitle" class="text-xs text-gray-500 mt-1">
                                {{ product.subtitle }}
                            </p>
                        </div>

                        <div class="flex items-center justify-between">
                            <p class="text-lg font-semibold text-gray-900">
                                {{ formatPrice(product) }}
                            </p>
                            <p class="text-xs text-gray-500">
                                {{ formatDate(product.created_at || '') }}
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

<script setup lang="ts">
import type { StoreProduct } from '@medusajs/types';

// Page metadata
definePageMeta({
  middleware: 'auth'
});

// Composables
const favoritesService = useFavorites();
const productsService = useProducts();
const cartStore = useCartStore();
const router = useRouter();

// Reactive state
const favorites = ref<StoreProduct[]>([]);
const isLoading = ref(false);
const isAddingToCart = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error'>('success');

// Computed properties
const favoriteCount = computed(() => favorites.value.length);

// Methods
const loadFavorites = async () => {
  try {
    isLoading.value = true;
    const favoriteIds = favoritesService.getFavoriteIds();
    
    if (favoriteIds.length === 0) {
      favorites.value = [];
      return;
    }

    // Fetch product details for each favorite ID
    const favoriteProducts: StoreProduct[] = [];
    for (const productId of favoriteIds) {
      try {
        const response = await productsService.getProduct(productId);
        favoriteProducts.push(response.product);
      } catch (error) {
        // If product not found, remove from favorites
        console.warn(`Product ${productId} not found, removing from favorites`);
        favoritesService.removeFromFavorites(productId);
      }
    }
    
    favorites.value = favoriteProducts;
  } catch (error) {
    console.error('Failed to load favorites:', error);
    showMessage('Favoriler yüklenirken bir hata oluştu', 'error');
  } finally {
    isLoading.value = false;
  }
};

const removeFromFavorites = async (productId: string) => {
  try {
    favoritesService.removeFromFavorites(productId);
    favorites.value = favorites.value.filter(product => product.id !== productId);
    showMessage('Ürün favorilerden çıkarıldı', 'success');
  } catch (error) {
    console.error('Failed to remove from favorites:', error);
    showMessage('Ürün favorilerden çıkarılırken bir hata oluştu', 'error');
  }
};

const clearAllFavorites = async () => {
  try {
    if (confirm('Tüm favorilerinizi temizlemek istediğinizden emin misiniz?')) {
      favoritesService.clearAllFavorites();
      favorites.value = [];
      showMessage('Tüm favoriler temizlendi', 'success');
    }
  } catch (error) {
    console.error('Failed to clear favorites:', error);
    showMessage('Favoriler temizlenirken bir hata oluştu', 'error');
  }
};

const addToCart = async (product: StoreProduct) => {
  try {
    isAddingToCart.value = true;
    
    // Get the first available variant
    const availableVariant = product.variants?.find(variant => 
      variant.inventory_quantity && variant.inventory_quantity > 0
    );
    
    if (!availableVariant) {
      showMessage('Bu ürün şu anda stokta bulunmuyor', 'error');
      return;
    }

    await cartStore.addToCart(availableVariant.id, 1);
    showMessage('Ürün sepete eklendi', 'success');
  } catch (error: any) {
    console.error('Failed to add to cart:', error);
    if (error.message === 'insufficient_inventory') {
      showMessage('Stokta yeterli ürün bulunmuyor', 'error');
    } else {
      showMessage('Ürün sepete eklenirken bir hata oluştu', 'error');
    }
  } finally {
    isAddingToCart.value = false;
  }
};

const navigateToProduct = (productId: string) => {
  const product = favorites.value.find(p => p.id === productId);
  if (product?.handle) {
    router.push(`/products/${product.handle}`);
  }
};

const navigateToProducts = () => {
  router.push('/products');
};

const formatPrice = (product: StoreProduct): string => {
  try {
    const prices = productHelper.extractProductFilters(product)['prices'] || [];
    if (prices.length > 0) {
      return `${prices[0].toFixed(2)} TL`;
    }
    return 'Fiyat bilgisi yok';
  } catch (error) {
    console.error('Error formatting price:', error);
    return 'Fiyat bilgisi yok';
  }
};

const formatDate = (dateString: string): string => {
  try {
    return utils.getOnlyDateFromString(dateString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
  message.value = msg;
  messageType.value = type;
  
  // Auto-hide message after 3 seconds
  setTimeout(() => {
    message.value = '';
  }, 3000);
};

// Lifecycle
onMounted(() => {
  loadFavorites();
});

// Watch for changes in favorites (in case they're updated from other pages)
const favoriteIds = computed(() => favoritesService.getFavoriteIds());
watch(favoriteIds, () => {
  loadFavorites();
}, { deep: true });
</script>