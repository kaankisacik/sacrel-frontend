<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header Section -->
        <div class="bg-white shadow-sm">
            <div class="container mx-auto px-4 py-8">
                <div class="text-center">
                    <h1 class="text-3xl font-bold text-gray-900 mb-4">Ürünler</h1>
                    <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                        Modern ve şık koleksiyonumuzu keşfedin. Kaliteli kumaşlar ve özel tasarımlarla hazırlanmış
                        ürünlerimizi
                        inceleyin.
                    </p>
                </div>
            </div>
        </div>

        <div class="container mx-auto px-4 py-8">
            <!-- Filters and Content Layout -->
            <div class="lg:grid lg:grid-cols-4 lg:gap-x-8">
                <!-- Filters Sidebar -->
                <div class="hidden lg:block">
                    <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
                        <h3 class="text-lg font-semibold text-gray-900 mb-6">Filtreler</h3>

                        <!-- Search Filter -->
                        <div class="mb-6">
                            <h4 class="text-sm font-medium text-gray-900 mb-3">Arama</h4>
                            <input v-model="searchQuery" type="text" placeholder="Arama..."
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500" />
                        </div>

                        <!-- Categories Filter -->
                        <div class="mb-6" v-if="categories.length">
                            <h4 class="text-sm font-medium text-gray-900 mb-3">Kategoriler</h4>
                            <div class="space-y-3">
                                <label v-for="(category, index) in categories" :key="index"
                                    class="flex items-center cursor-pointer">
                                    <input v-model="selectedCategories" :value="category" type="checkbox"
                                        class="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded" />
                                    <span class="ml-3 text-sm text-gray-600">{{ category }}</span>
                                </label>
                            </div>
                        </div>

                        <!-- Price Range Filter -->
                        <div class="mb-6">
                            <h4 class="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
                            <div class="space-y-3">
                                <label v-for="priceRange in priceRanges" :key="priceRange.value"
                                    class="flex items-center cursor-pointer">
                                    <input v-model="selectedPriceRange" :value="priceRange.value" type="radio"
                                        name="priceRange"
                                        class="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300" />
                                    <span class="ml-3 text-sm text-gray-600">{{ priceRange.label }}</span>
                                </label>
                            </div>
                        </div>

                        <!-- Colors Filter -->
                        <div class="mb-6">
                            <h4 class="text-sm font-medium text-gray-900 mb-3">Renkler</h4>
                            <div class="grid grid-cols-4 gap-2">
                                <button v-for="color in colors" :key="color.value" @click="toggleColor(color.value)"
                                    :class="[
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
                            Filters
                        </button>
                    </div>

                    <!-- Sort Options -->
                    <div class="flex items-center justify-between mb-6">
                        <p class="text-sm text-gray-600">
                            {{ filteredItems.length }} ürün bulundu
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
                                <option value="newest">En Yeni</option>
                            </select>
                        </div>
                    </div>

                    <!-- Loading State -->
                    <div v-if="isLoading" class="min-h-96 flex items-center justify-center">
                        <div class="text-center">
                            <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
                            <p class="mt-4 text-gray-600">Yükleniyor...</p>
                        </div>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="hasError" class="text-center py-12">
                        <div class="w-24 h-24 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                            <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Error occurred</h3>
                        <p class="text-gray-600 mb-4">{{ errorMessage || 'An error occurred while loading data.' }}</p>
                        <button @click="refreshData"
                            class="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition duration-300">
                            Try Again
                        </button>
                    </div>

                    <!-- No Items -->
                    <div v-else-if="filteredItems.length === 0" class="text-center py-12">
                        <div class="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Hiç ürün bulunamadı</h3>
                        <p class="text-gray-600 mb-4">Mevcut filtrelerinize uyan ürün yok.</p>
                        <button @click="clearFilters" class="text-gray-900 font-medium hover:text-gray-700">
                            Filtreleri temizle
                        </button>
                    </div>

                    <!-- Items Grid -->
                    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <!-- Replace with your item component -->
                        <ProductCard v-for="item in filteredItems" :key="item.id" :product="item" />
                    </div>

                    <!-- Load More Button -->
                    <div v-if="!isLoading && filteredItems.length > 0 && hasMore" class="text-center mt-12">
                        <button @click="loadMoreItems" :disabled="loadingMore"
                            class="bg-gray-900 text-white px-8 py-3 font-medium hover:bg-gray-800 transition duration-300 disabled:opacity-50">
                            {{ loadingMore ? 'Yükleniyor...' : 'Daha Fazla Yükle' }}
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
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Mobile filter content -->
                <div class="space-y-6">
                    <!-- Search -->
                    <div>
                        <h4 class="text-sm font-medium text-gray-900 mb-3">Arama</h4>
                        <input v-model="searchQuery" type="text" placeholder="Arama..."
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500" />
                    </div>

                    <!-- Categories -->
                    <div v-if="categories.length">
                        <h4 class="text-sm font-medium text-gray-900 mb-3">Kategoriler</h4>
                        <div class="space-y-3">
                            <label v-for="(category, index) in categories" :key="index"
                                class="flex items-center cursor-pointer">
                                <input v-model="selectedCategories" :value="index" type="checkbox"
                                    class="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded" />
                                <span class="ml-3 text-sm text-gray-600">{{ category }}</span>
                            </label>
                        </div>
                    </div>

                    <!-- Price Range -->
                    <div>
                        <h4 class="text-sm font-medium text-gray-900 mb-3">Fiyat Aralığı</h4>
                        <div class="space-y-3">
                            <label v-for="priceRange in priceRanges" :key="priceRange.value"
                                class="flex items-center cursor-pointer">
                                <input v-model="selectedPriceRange" :value="priceRange.value" type="radio"
                                    name="priceRange"
                                    class="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300" />
                                <span class="ml-3 text-sm text-gray-600">{{ priceRange.label }}</span>
                            </label>
                        </div>
                    </div>

                    <!-- Colors -->
                    <div>
                        <h4 class="text-sm font-medium text-gray-900 mb-3">Colors</h4>
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

const { products, allProductFilters } = storeToRefs(useProductStore())

// Reactive state
const searchQuery = ref<string>('')
const selectedCategories = ref<string[]>([])
const selectedPriceRange = ref<string>('')
const selectedColors = ref<string[]>([])
const sortBy = ref<string>('default')
const showMobileFilters = ref<boolean>(false)
const isLoading = ref<boolean>(true)
const hasError = ref<boolean>(false)
const errorMessage = ref<string>('')
const loadingMore = ref<boolean>(false)
const hasMore = ref<boolean>(true)

// Data arrays - replace with your actual data
const items = computed(() => products.value.products || [])
const categories = computed(() => Object.keys(allProductFilters.value?.categories || {}) || [])
const priceRanges: any[] = [
    { value: '0-1000', label: '1000 TL Altı' },
    { value: '1000-2000', label: '1000 TL - 2000 TL' },
    { value: '2000-3000', label: '2000 TL - 3000 TL' },
    { value: '3000-∞', label: '3000 TL Üstü' }
]
const colors = computed<any[]>(() => {
    const colors: any[] = []
    Object.keys(allProductFilters.value?.colors || {}).forEach(color => {
        colors.push({
            value: color,
            label: color.charAt(0).toUpperCase() + color.slice(1),
            class: productHelper.getColorBgTailwind(color)
        })
    })
    return colors
})



// Computed properties
const filteredItems = computed(() => {
    let filtered = [...items.value]

    // Search filter
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase().trim()
        filtered = filtered.filter(item =>
            item.title?.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query)
        )
    }
    console.log('Selected Categories:', selectedCategories.value);


    // Category filter
    if (selectedCategories.value.length > 0) {
        filtered = filtered.filter(item =>
            selectedCategories.value.some((categoryKey: string) => allProductFilters.value?.categories[categoryKey]?.includes(item.id))
        )
    }
    console.log(
        'selectedPriceRange value:', selectedPriceRange.value
    );

    // Price range filter
    if (selectedPriceRange.value) {

        const itemPrices = Object.keys(allProductFilters.value?.prices || {}).map(price => parseFloat(price));
        filtered = filtered.filter(item => {
            const splitted = selectedPriceRange.value.split('-')
            const minPrice = parseFloat(splitted[0]!)
            const maxPrice = splitted[1] === '∞' ? Infinity : parseFloat(splitted[1]!)

            var priceKeys = itemPrices.filter(itemPrice => itemPrice >= minPrice && itemPrice <= maxPrice);

            console.log("priceKeys:", priceKeys);
            return priceKeys.some(priceKey => {
                return allProductFilters.value?.prices[priceKey]?.includes(item.id)
            })


        })
    }

    // Color filter
    if (selectedColors.value.length > 0) {
        filtered = filtered.filter(item =>
            selectedColors.value.some(colorValue => {
                return allProductFilters.value?.colors[colorValue]?.includes(item.id)
            })
        )
    }

    // Sort
    switch (sortBy.value) {
        case 'price-low':
            // Implement price sorting
            break
        case 'price-high':
            // Implement price sorting

            break
        case 'name-asc':
            filtered.sort((a, b) => a.title?.localeCompare(b.title) || 0)
            break
        case 'name-desc':
            filtered.sort((a, b) => b.title?.localeCompare(a.title) || 0)
            break
        case 'newest':
            // Implement date sorting
            break
    }

    return filtered
})

// Methods
const toggleColor = (colorValue: string): void => {
    const index = selectedColors.value.indexOf(colorValue)
    if (index > -1) {
        selectedColors.value.splice(index, 1)
    } else {
        selectedColors.value.push(colorValue)
    }
}

const clearFilters = (): void => {
    searchQuery.value = ''
    selectedCategories.value = []
    selectedPriceRange.value = ''
    selectedColors.value = []
    sortBy.value = 'default'
}

const loadData = async (): Promise<void> => {
    try {
        isLoading.value = true
        hasError.value = false

        // Implement your data loading logic here
        await new Promise(resolve => setTimeout(resolve, 1000))


    } catch (error) {
        hasError.value = true
        errorMessage.value = 'An error occurred while loading data.'
    } finally {
        isLoading.value = false
    }
}

const refreshData = (): void => {
    loadData()
}

const loadMoreItems = async (): Promise<void> => {
    try {
        loadingMore.value = true

        // Implement your load more logic here
        await new Promise(resolve => setTimeout(resolve, 500))

        // Add more items to the array
        // items.value.push(...moreItems)

    } catch (error) {
        console.error('Error loading more items:', error)
    } finally {
        loadingMore.value = false
    }
}

// Lifecycle
onMounted(() => {
    loadData()
})
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