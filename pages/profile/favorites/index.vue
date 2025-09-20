<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Favorilerim</h1>
      <p class="mt-2 text-gray-600">
        Beğendiğiniz ürünleri buradan takip edebilirsiniz
      </p>
    </div>

    <!-- Main Content Area - Consistent structure for SSR/Client hydration -->
    <div class="min-h-[400px]">
      <ClientOnly>
        <template #default>
          <!-- Empty State -->
          <div v-if="isInitialized && !isLoading && favoriteProducts.length === 0" class="text-center py-12">
            <div
              class="h-24 w-24 text-gray-300 mx-auto mb-4 flex items-center justify-center"
            >
              <svg class="h-full w-full" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              Henüz favori ürününüz bulunmuyor
            </h3>
            <p class="text-gray-600 mb-6">
              Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca
              bulabilirsiniz.
            </p>
            <button
              @click="navigateToProducts"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sacrel-accent/70 hover:bg-sacrel-accent"
            >
              Ürünleri Keşfet
            </button>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-12">
            <div class="text-red-500 mb-4">
              <svg class="h-12 w-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              Bir hata oluştu
            </h3>
            <p class="text-gray-600 mb-6">{{ error }}</p>
            <button
              @click="favoritesStore.initializeFavorites()"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Tekrar Dene
            </button>
          </div>

          <!-- Loading State -->
          <div v-else-if="!isInitialized || isLoading" class="text-center py-12">
            <div
              class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"
            ></div>
            <p class="mt-4 text-gray-600">Favoriler yükleniyor...</p>
          </div>

          <!-- Favorites Grid -->
          <div v-else-if="isInitialized && !isLoading && favoriteProducts.length > 0">
            <!-- Action Bar -->
            <div class="flex justify-between items-center mb-6">
              <p class="text-sm text-gray-600">
                {{ favoriteCount }} ürün favorilerinizde
              </p>
              <button
                v-if="favoriteProducts.length > 0"
                @click="clearAllFavorites"
                class="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Tümünü Temizle
              </button>
            </div>

            <!-- Products Grid -->
            <div
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6"
            >
              <ProductCard
                v-for="product in favoriteProducts"
                :key="product.id"
                :product="product"
              />
            </div>
          </div>
        </template>
        
        <template #fallback>
          <!-- Server-side fallback - consistent structure -->
          <div class="text-center py-12">
            <div
              class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"
            ></div>
            <p class="mt-4 text-gray-600">Favoriler yükleniyor...</p>
          </div>
        </template>
      </ClientOnly>
    </div>

    <!-- Success/Error Messages -->
    <div
      v-if="message"
      :class="
        messageType === 'success'
          ? 'bg-green-50 border-green-200 text-green-800'
          : 'bg-red-50 border-red-200 text-red-800'
      "
      class="fixed bottom-4 right-4 p-4 border rounded-md shadow-lg z-50"
    >
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
// Page metadata
definePageMeta({
  middleware: "auth",
});

// Store references
const favoritesStore = useFavoritesStore();
const router = useRouter();

// Reactive state from store
const { favorites, favoriteProducts, isLoading, error, isInitialized } = storeToRefs(favoritesStore);
const { favoriteCount } = favoritesStore;

// Local reactive state
const message = ref("");
const messageType = ref<"success" | "error">("success");

// Methods
const clearAllFavorites = async () => {
  if (confirm('Tüm favori ürünlerinizi silmek istediğinizden emin misiniz?')) {
    try {
      await favoritesStore.clearAllFavorites();
      showMessage("Tüm favoriler temizlendi", "success");
    } catch (error) {
      console.error('Failed to clear favorites:', error);
      showMessage("Favoriler temizlenirken bir hata oluştu", "error");
    }
  }
};

const navigateToProducts = () => {
  router.push('/products');
};

const showMessage = (msg: string, type: "success" | "error" = "success") => {
  message.value = msg;
  messageType.value = type;

  // Auto-hide message after 3 seconds
  setTimeout(() => {
    message.value = "";
  }, 3000);
};

// Initialize favorites on client-side only
onMounted(async () => {
  if (import.meta.client) {
    try {
      await favoritesStore.initializeFavorites();
    } catch (error) {
      console.error('Failed to initialize favorites:', error);
      showMessage("Favoriler yüklenirken bir hata oluştu", "error");
    }
  }
});

// SEO
useHead({
  title: 'Favorilerim - Your Store',
  meta: [
    {
      name: 'description',
      content: 'Beğendiğiniz ürünleri favorilerinizde saklayın ve kolayca takip edin.'
    }
  ]
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
