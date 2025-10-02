<template>
  <div class="min-h-screen">
    <!-- Header Section -->
    <!-- <div class="bg-white shadow-sm">
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
        </div> -->

    <div class="container mx-auto px-4 py-8">
      <!-- Filters and Content Layout -->
      <div class="lg:grid lg:grid-cols-4 lg:gap-x-8">
        <!-- Main Content -->
        <div class="lg:col-span-6">
          <!-- Sort Options -->
          <div class="w-full flex items-center justify-between mb-6 2xl:px-8">
            <p class="text-sm text-gray-600">
              {{ filteredItems.length }} ürün bulundu
            </p>
            <div class="flex flex-col md:flex-row md:items-center md:space-x-4">
              <label for="sort" class="hidden md:block text-sm text-gray-600"
                >Sırala:</label
              >
              <select
                id="sort"
                v-model="sortBy"
                class="text-sm border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
              >
                <option value="newest">Varsayılan</option>
                <option value="price-low">Fiyat: Düşükten Yükseğe</option>
                <option value="price-high">Fiyat: Yüksekten Düşüğe</option>
              </select>
            </div>
          </div>

          <!-- Loading State -->
          <div
            v-if="isLoading"
            class="min-h-96 flex items-center justify-center"
          >
            <div class="text-center">
              <div
                class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"
              ></div>
              <p class="mt-4 text-gray-600">Yükleniyor...</p>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="hasError" class="text-center py-12">
            <div
              class="w-24 h-24 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center"
            >
              <svg
                class="w-12 h-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              Error occurred
            </h3>
            <p class="text-gray-600 mb-4">
              {{ errorMessage || "An error occurred while loading data." }}
            </p>
            <button
              @click="refreshData"
              class="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition duration-300"
            >
              Try Again
            </button>
          </div>

          <!-- No Items -->
          <div v-else-if="filteredItems.length === 0" class="text-center py-12">
            <div
              class="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center"
            >
              <svg
                class="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              Hiç ürün bulunamadı
            </h3>
            <p class="text-gray-600 mb-4">
              Mevcut filtrelerinize uyan ürün yok.
            </p>
            <button
              @click="clearFilters"
              class="text-gray-900 font-medium hover:text-gray-700"
            >
              Filtreleri temizle
            </button>
          </div>

          <!-- Items Grid -->
          <div
            v-else
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-24 gap-y-12"
          >
            <!-- Replace with your item component -->
            <ProductCard
              v-for="item in filteredItems"
              :key="item.id"
              :product="item"
            />
          </div>

          <!-- Load More Button -->
          <!-- <div v-if="!isLoading && filteredItems.length > 0 && hasMore" class="text-center mt-12">
                        <button @click="loadMoreItems" :disabled="loadingMore"
                            class="bg-gray-900 text-white px-8 py-3 font-medium hover:bg-gray-800 transition duration-300 disabled:opacity-50">
                            {{ loadingMore ? 'Yükleniyor...' : 'Daha Fazla Yükle' }}
                        </button>
                    </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StoreProductCategory } from "@medusajs/types";

const {
  products,
  allProductFilters,
  searchQuery,
  categoryQuery,
  selectedCategories,
  selectedPriceRange,
  selectedColors,
  sortBy,
} = storeToRefs(useProductStore());

const showMobileFilters = ref<boolean>(false);
const isLoading = ref<boolean>(true);
const hasError = ref<boolean>(false);
const errorMessage = ref<string>("");
const loadingMore = ref<boolean>(false);
const hasMore = ref<boolean>(true);

// Data arrays - replace with your actual data
const items = computed(() => products.value.products || []);
const categories = computed(
  () => Object.keys(allProductFilters.value?.categories || {}) || []
);

const colors = computed<any[]>(() => {
  const colors: any[] = [];
  Object.keys(allProductFilters.value?.colors || {}).forEach((color) => {
    colors.push({
      value: color,
      label: color.charAt(0).toUpperCase() + color.slice(1),
      class: productHelper.getColorBgTailwind(color),
    });
  });
  return colors;
});

// Handle search query from router and sync with URL
const router = useRouter();
const route = useRoute();
const isUpdatingFromUrl = ref(false);

var categoriesArray = computed(() => useCategories().getCategories() || []);
// Check if user came with search query in URL and set it
// URL'den arama sorgusu geldiğinde bunu ayarla
onMounted(async () => {
  const urlSearchQuery = route.query.search as string;
  if (urlSearchQuery) {
    isUpdatingFromUrl.value = true;
    searchQuery.value = urlSearchQuery;
    nextTick(() => {
      isUpdatingFromUrl.value = false;
    });
  }
  const urlCategoryQuery = route.query.category as string;
  if (urlCategoryQuery) {
    isUpdatingFromUrl.value = true;
    console.log("Categories Array:", categoriesArray.value);
    console.log("URL Category Query:", urlCategoryQuery);

    const filteredCategory =
      (await categoriesArray.value).product_categories.find(
        (cat: StoreProductCategory) =>
          utils.searchQueryHelper.normalizeSearchQuery(cat.handle) ===
          utils.searchQueryHelper.normalizeSearchQuery(urlCategoryQuery)
      )?.name || "";
    console.log("Filtered Category:", filteredCategory);

    selectedCategories.value = [filteredCategory];
    nextTick(() => {
      isUpdatingFromUrl.value = false;
    });
  }
});

watch(
  searchQuery,
  (newQuery, oldQuery) => {
    // Mevcut URL'deki arama sorgusunu kontrol et
    const currentUrlQuery = (route.query.search as string) || "";

    // Eğer yeni sorgu URL'dekinden farklıysa güncelle
    if (newQuery.trim() !== currentUrlQuery) {
      if (newQuery.trim()) {
        router.push(`/products?search=${encodeURIComponent(newQuery.trim())}`);
      } else {
        router.push("/products");
      }
    }
  },
  { flush: "post" }
);

watch(
  categoryQuery,
  async (newQuery, oldQuery) => {
    // Eğer yeni sorgu URL'dekinden farklıysa güncelle
    const filteredCategory =
      (await categoriesArray.value).product_categories.find(
        (cat: StoreProductCategory) =>
          utils.searchQueryHelper.normalizeSearchQuery(cat.handle) ===
          utils.searchQueryHelper.normalizeSearchQuery(newQuery)
      )?.name || "";
    console.log("Filtered Category:", filteredCategory);

    selectedCategories.value = [filteredCategory];
  },
  { flush: "post" }
);

// Watch for route changes to clear filters when navigating to /products without query params
watch(
  () => route.query,
  (newQuery, oldQuery) => {
    if (isUpdatingFromUrl.value) return;

    // If there are no search or category queries, clear all filters
    if (!newQuery.search && !newQuery.category) {
      searchQuery.value = "";
      categoryQuery.value = "";
      selectedCategories.value = [];
      selectedPriceRange.value = "";
      selectedColors.value = [];
    }
  },
  { deep: true }
);

// Computed properties
const filteredItems = computed(() => {
  let filtered = [...items.value];

  // Search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(
      (item) =>
        item.title?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
    );
  }
  console.log("Selected Categories:", selectedCategories.value);

  // Category filter
  if (selectedCategories.value.length > 0) {
    filtered = filtered.filter((item) =>
      selectedCategories.value.some((categoryKey: string) =>
        allProductFilters.value?.categories[categoryKey]?.includes(item.id)
      )
    );
  }
  console.log("selectedPriceRange value:", selectedPriceRange.value);

  // Price range filter
  if (selectedPriceRange.value) {
    const itemPrices = Object.keys(allProductFilters.value?.prices || {}).map(
      (price) => parseFloat(price)
    );
    filtered = filtered.filter((item) => {
      const splitted = selectedPriceRange.value.split("-");
      const minPrice = parseFloat(splitted[0]!);
      const maxPrice =
        splitted[1] === "∞" ? Infinity : parseFloat(splitted[1]!);

      var priceKeys = itemPrices.filter(
        (itemPrice) => itemPrice >= minPrice && itemPrice <= maxPrice
      );

      console.log("priceKeys:", priceKeys);
      return priceKeys.some((priceKey) => {
        return allProductFilters.value?.prices[priceKey]?.includes(item.id);
      });
    });
  }

  // Color filter
  if (selectedColors.value.length > 0) {
    filtered = filtered.filter((item) =>
      selectedColors.value.some((colorValue) => {
        return allProductFilters.value?.colors[colorValue]?.includes(item.id);
      })
    );
  }

  // Sort
  switch (sortBy.value) {
    case "price-low":
      // Implement price sorting
      filtered.sort((a, b) => {
        const priceA =
          productHelper.extractProductFilters(a)["prices"]?.[0] || 0;
        const priceB =
          productHelper.extractProductFilters(b)["prices"]?.[0] || 0;
        return priceA - priceB;
      });
      break;
    case "price-high":
      // Implement price sorting
      filtered.sort((a, b) => {
        const priceA =
          productHelper.extractProductFilters(a)["prices"]?.[0] || 0;
        const priceB =
          productHelper.extractProductFilters(b)["prices"]?.[0] || 0;
        return priceB - priceA;
      });
      break;
    case "name-asc":
      filtered.sort((a, b) => a.title?.localeCompare(b.title) || 0);
      break;
    case "name-desc":
      filtered.sort((a, b) => b.title?.localeCompare(a.title) || 0);
      break;
    case "newest":
    case "default":
      filtered.sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
      );
      break;
  }

  return filtered;
});

const clearFilters = (): void => {
  searchQuery.value = "";
  categoryQuery.value = "";
  selectedCategories.value = [];
  selectedPriceRange.value = "";
  selectedColors.value = [];
  sortBy.value = "newest";
  // Also clear URL query parameters
  router.push("/products");
};

const loadData = async (): Promise<void> => {
  try {
    isLoading.value = true;
    hasError.value = false;

    // Load products from the store
    const productStore = useProductStore();
    await productStore.getProducts();
  } catch (error) {
    hasError.value = true;
    errorMessage.value = "An error occurred while loading data.";
    console.error("Error loading products:", error);
  } finally {
    isLoading.value = false;
  }
};

const refreshData = (): void => {
  loadData();
};

const loadMoreItems = async (): Promise<void> => {
  try {
    loadingMore.value = true;

    // Implement your load more logic here
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Add more items to the array
    // items.value.push(...moreItems)
  } catch (error) {
    console.error("Error loading more items:", error);
  } finally {
    loadingMore.value = false;
  }
};

// Lifecycle
onMounted(() => {
  loadData();
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
