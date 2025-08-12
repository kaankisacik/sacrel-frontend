<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-8">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">Ürünler</h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Modern ve şık koleksiyonumuzu keşfedin. Kaliteli kumaşlar ve özel tasarımlarla hazırlanmış ürünlerimizi
            inceleyin.
          </p>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Filters and Sorting Section -->
      <div class="lg:grid lg:grid-cols-4 lg:gap-x-8">
        <!-- Filters Sidebar -->
        <div class="hidden lg:block">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Filtreler</h3>

            <!-- Search Filter -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Arama</h4>
              <input v-model="searchQuery" type="text" placeholder="Ürün ara..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500" />
            </div>

            <!-- Categories Filter -->
            <div class="mb-6" v-if="medusaCategories.length">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Kategoriler</h4>
              <div class="space-y-3">
                <label v-for="category in medusaCategories" :key="category.id" class="flex items-center cursor-pointer">
                  <input v-model="selectedCategories" :value="category.id" type="checkbox"
                    class="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded" />
                  <span class="ml-3 text-sm text-gray-600">{{ category.title }}</span>
                </label>
              </div>
            </div>

            <!-- Price Range Filter -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Fiyat Aralığı</h4>
              <div class="space-y-3">
                <label v-for="priceRange in priceRanges" :key="priceRange.value"
                  class="flex items-center cursor-pointer">
                  <input v-model="selectedPriceRange" :value="priceRange.value" type="radio" name="priceRange"
                    class="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300" />
                  <span class="ml-3 text-sm text-gray-600">{{ priceRange.label }}</span>
                </label>
              </div>
            </div>

            <!-- Colors Filter -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Renkler</h4>
              <div class="grid grid-cols-4 gap-2">
                <button v-for="color in colors" :key="color.value" @click="toggleColor(color.value)" :class="[
                  'w-8 h-8 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500',
                  color.class,
                  selectedColors.includes(color.value) ? 'ring-2 ring-gray-900' : 'border-gray-300'
                ]" :title="color.label" />
              </div>
            </div>

            <!-- Clear Filters -->
            <button @click="clearFilters"
              class="w-full text-sm text-gray-600 hover:text-gray-900 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 transition duration-300">
              Filtreleri Temizle
            </button>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3">
          <!-- Mobile Filter Toggle & Sort -->
          <div class="flex items-center justify-between mb-6 lg:hidden">
            <button @click="showMobileFilters = !showMobileFilters"
              class="flex items-center text-gray-700 bg-white px-4 py-2 border border-gray-300 rounded-md">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtreler
            </button>
          </div>

          <!-- Sort Options -->
          <div class="flex items-center justify-between mb-6">
            <p class="text-sm text-gray-600">
              {{ filteredProducts.length }} ürün gösteriliyor
            </p>
            <div class="flex items-center space-x-4">
              <label for="sort" class="text-sm text-gray-600">Sırala:</label>
              <select id="sort" v-model="sortBy"
                class="text-sm border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500">
                <option value="default">Varsayılan</option>
                <option value="price-low">Fiyat: Düşükten Yükseğe</option>
                <option value="price-high">Fiyat: Yüksekten Düşüğe</option>
                <option value="name-asc">İsim: A-Z</option>
                <option value="name-desc">İsim: Z-A</option>
                <option value="newest">Yeni Eklenenler</option>
              </select>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="pending" class="min-h-96 flex items-center justify-center">
            <div class="text-center">
              <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
              <p class="mt-4 text-gray-600">Ürünler yükleniyor...</p>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-12">
            <div class="w-24 h-24 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Hata oluştu</h3>
            <p class="text-gray-600 mb-4">{{ error.message || 'Ürünler yüklenirken bir hata oluştu.' }}</p>
            <button @click="refresh()"
              class="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition duration-300">
              Tekrar Dene
            </button>
          </div>

          <!-- No Products -->
          <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
            <div class="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Ürün bulunamadı</h3>
            <p class="text-gray-600 mb-4">Seçtiğiniz filtrelere uygun ürün bulunmamaktadır.</p>
            <button @click="clearFilters" class="text-gray-900 font-medium hover:text-gray-700">
              Filtreleri temizle
            </button>
          </div>

          <!-- Products Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard v-for="product in filteredProducts" :key="product.id" :product="transformProduct(product)" />
          </div>

          <!-- Load More Button -->
          <div v-if="!pending && filteredProducts.length > 0 && hasMore" class="text-center mt-12">
            <button @click="loadMoreProducts" :disabled="loadingMore"
              class="bg-gray-900 text-white px-8 py-3 font-medium hover:bg-gray-800 transition duration-300 disabled:opacity-50">
              {{ loadingMore ? 'Yükleniyor...' : 'Daha Fazla Ürün Yükle' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Filters Modal -->
    <div v-if="showMobileFilters" class="fixed inset-0 z-50 lg:hidden">
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="showMobileFilters = false"></div>
      <div class="fixed right-0 top-0 h-full w-80 bg-white shadow-xl p-6 overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Filtreler</h3>
          <button @click="showMobileFilters = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Mobile filter content -->
        <div class="space-y-6">
          <!-- Search -->
          <div>
            <h4 class="text-sm font-medium text-gray-900 mb-3">Arama</h4>
            <input v-model="searchQuery" type="text" placeholder="Ürün ara..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500" />
          </div>

          <!-- Categories -->
          <div v-if="medusaCategories.length">
            <h4 class="text-sm font-medium text-gray-900 mb-3">Kategoriler</h4>
            <div class="space-y-3">
              <label v-for="category in medusaCategories" :key="category.id" class="flex items-center cursor-pointer">
                <input v-model="selectedCategories" :value="category.id" type="checkbox"
                  class="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded" />
                <span class="ml-3 text-sm text-gray-600">{{ category.title }}</span>
              </label>
            </div>
          </div>

          <!-- Price Range -->
          <div>
            <h4 class="text-sm font-medium text-gray-900 mb-3">Fiyat Aralığı</h4>
            <div class="space-y-3">
              <label v-for="priceRange in priceRanges" :key="priceRange.value" class="flex items-center cursor-pointer">
                <input v-model="selectedPriceRange" :value="priceRange.value" type="radio" name="priceRange"
                  class="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300" />
                <span class="ml-3 text-sm text-gray-600">{{ priceRange.label }}</span>
              </label>
            </div>
          </div>

          <!-- Colors -->
          <div>
            <h4 class="text-sm font-medium text-gray-900 mb-3">Renkler</h4>
            <div class="grid grid-cols-4 gap-2">
              <button v-for="color in colors" :key="color.value" @click="toggleColor(color.value)" :class="[
                'w-8 h-8 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500',
                color.class,
                selectedColors.includes(color.value) ? 'ring-2 ring-gray-900' : 'border-gray-300'
              ]" :title="color.label" />
            </div>
          </div>
        </div>

        <div class="mt-8 space-y-3">
          <button @click="clearFilters"
            class="w-full text-sm text-gray-600 hover:text-gray-900 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 transition duration-300">
            Filtreleri Temizle
          </button>
          <button @click="showMobileFilters = false"
            class="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition duration-300">
            Filtreleri Uygula
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO
useSeoMeta({
  title: 'Ürünler - SACREL',
  description: 'Modern ve şık koleksiyonumuzu keşfedin. Kaliteli kumaşlar ve özel tasarımlarla hazırlanmış ürünlerimizi inceleyin.',
  ogTitle: 'Ürünler - SACREL',
  ogDescription: 'Modern ve şık koleksiyonumuzu keşfedin.',
  ogImage: '/images/og-products.jpg'
})

// Composables
const { getProducts, getCollections } = useProducts()

// Reactive data
const showMobileFilters = ref(false)
const searchQuery = ref('')
const selectedCategories = ref<string[]>([])
const selectedPriceRange = ref('')
const selectedColors = ref<string[]>([])
const sortBy = ref('default')
const loadingMore = ref(false)
const currentPage = ref(1)
const pageSize = 20

// Filter options
const priceRanges = [
  { value: '', label: 'Tümü' },
  { value: '0-100', label: '0 - 100 TL' },
  { value: '100-300', label: '100 - 300 TL' },
  { value: '300-500', label: '300 - 500 TL' },
  { value: '500-1000', label: '500 - 1000 TL' },
  { value: '1000+', label: '1000+ TL' }
]

const colors = [
  { value: 'Black', label: 'Siyah', class: 'bg-black' },
  { value: 'White', label: 'Beyaz', class: 'bg-white border' },
  { value: 'Gray', label: 'Gri', class: 'bg-gray-500' },
  { value: 'Red', label: 'Kırmızı', class: 'bg-red-500' },
  { value: 'Blue', label: 'Mavi', class: 'bg-blue-500' },
  { value: 'Green', label: 'Yeşil', class: 'bg-green-500' },
  { value: 'Pink', label: 'Pembe', class: 'bg-pink-500' },
  { value: 'Yellow', label: 'Sarı', class: 'bg-yellow-500' },
  { value: 'Purple', label: 'Mor', class: 'bg-purple-500' },
  { value: 'Brown', label: 'Kahverengi', class: 'bg-amber-800' },
  { value: 'Navy', label: 'Lacivert', class: 'bg-blue-900' },
  { value: 'Beige', label: 'Bej', class: 'bg-amber-100' }
]

// Fetch products and collections from Medusa
const { data: productsData, pending, error, refresh } = await useLazyAsyncData(
  'products',
  () => Promise.all([
    getProducts({ limit: pageSize, offset: 0 }),
    getCollections()
  ])
)


const products = computed(() => productsData.value?.[0]?.products || [])
const medusaCategories = computed(() => productsData.value?.[1] || [])
const hasMore = computed(() => {
  const total = productsData.value?.[0]?.count || 0
  return products.value.length < total
})

watch(productsData, (newData) => {
  console.log("Products data updated:", newData);

})

// Transform product for consistency with existing ProductCard component
const transformProduct = (product: any) => {
  console.log(`Transforming product: ${product.title}`, product);
  // Extract all unique colors from variants
  const variantColors = product.variants
    ?.map((v: { options: any[] }) => v.options?.find((opt: { option: { title: string } }) => opt.option.title.toLowerCase() === 'color')?.value)
    .filter(Boolean) || [];
  const uniqueColors: string[] = Array.from(new Set(variantColors));

  console.log(`Unique colors for product ${product.title}:`, uniqueColors);
  
  return {
    ...product,
    image: product.thumbnail || product.images?.[0]?.url || '/images/placeholder-product.jpg',
    hoverImage: product.images?.[1]?.url || product.images?.[0]?.url || '/images/placeholder-product.jpg',
    price: product.variants?.[0]?.calculated_price ?
      (product.variants[0]?.calculated_price?.calculated_amount) : 0,
    discountedPrice: product.variants?.[0]?.original_price && product.variants?.[0]?.calculated_price < product.variants?.[0]?.original_price ?
      (product.variants[0]?.calculated_price?.calculated_amount ) : null,
    currency: 'TRY',
    category: product.collection?.handle || 'uncategorized',
    colors: uniqueColors || [],
  }
}

  // Computed property for filtered products
  const filteredProducts = computed(() => {
    let filtered = [...products.value]

    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(product =>
        product.title?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      )
    }

    // Filter by categories (collections)
    if (selectedCategories.value.length > 0) {
      filtered = filtered.filter(product =>
        product.collection_id && selectedCategories.value.includes(product.collection_id)
      )
    }

    // Filter by price range
    if (selectedPriceRange.value) {
      filtered = filtered.filter(product => {
        const price = transformProduct(product).price
        if (selectedPriceRange.value === '1000+') {
          return price >= 1000
        }
        const parts = selectedPriceRange.value.split('-')
        if (parts.length === 2 && parts[0] && parts[1]) {
          const min = parseFloat(parts[0])
          const max = parseFloat(parts[1])
          return price >= min && price <= max
        }
        return true
      })
    }

    // Filter by colors
    if (selectedColors.value.length > 0) {
      filtered = filtered.filter(product => {
        const colors = transformProduct(product).colors || []
        console.log(`Checking colors for product ${product.title}:`, colors, selectedColors.value);
        return selectedColors.value.some(color => colors.includes(color))
      })
    }

    // Sort products
    switch (sortBy.value) {
      case 'price-low':
        filtered.sort((a, b) => transformProduct(a).price - transformProduct(b).price)
        break
      case 'price-high':
        filtered.sort((a, b) => transformProduct(b).price - transformProduct(a).price)
        break
      case 'name-asc':
        filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
        break
      case 'name-desc':
        filtered.sort((a, b) => (b.title || '').localeCompare(a.title || ''))
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        break
      default:
        // Keep original order
        break
    }

    return filtered
  })

  // Methods
  const toggleColor = (colorValue: string) => {
    const index = selectedColors.value.indexOf(colorValue)
    console.log(`Toggling color: ${colorValue}`, index);
    if (index > -1) {
      selectedColors.value.splice(index, 1)
    } else {
      selectedColors.value.push(colorValue)
    }
  }

  const clearFilters = () => {
    searchQuery.value = ''
    selectedCategories.value = []
    selectedPriceRange.value = ''
    selectedColors.value = []
    sortBy.value = 'default'
  }

  const loadMoreProducts = async () => {
    if (loadingMore.value || !hasMore.value) return

    loadingMore.value = true
    try {
      const offset = currentPage.value * pageSize
      const moreProducts = await getProducts({ limit: pageSize, offset })

      if (moreProducts.products && productsData.value?.[0]?.products) {
        productsData.value[0].products.push(...moreProducts.products)
        currentPage.value++
      }
    } catch (error) {
      console.error('Error loading more products:', error)
    } finally {
      loadingMore.value = false
    }
  }

  // Watch for URL query parameters
  const route = useRoute()
  watch(() => route.query, (newQuery) => {
    if (newQuery.search) searchQuery.value = String(newQuery.search)
    if (newQuery.collection) selectedCategories.value = [String(newQuery.collection)]
  }, { immediate: true })
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
