<template>
  <NuxtLink
    :to="`/products/${product.handle}`"
    class="w-full max-w-sm mx-auto overflow-hidden cursor-pointer group border-4 border-black"
  >
    <div
      class="relative h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px] lg:aspect-3-4 overflow-hidden"
    >
      <!-- Main Product Image -->
      <img
        :src="product.thumbnail || '/images/placeholder.svg'"
        :alt="product.title"
        class="absolute h-full w-full p-4 object-cover"
        @error="handleImageError"
      />

      <!-- Hover Image -->
      <!-- <img v-if="product.hoverImage" :src="product.hoverImage" :alt="`${product.title} Hover`"
                class="absolute inset-0 h-full w-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105" /> -->

      <!-- Discount Badge -->
      <!-- <div v-if="true" class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                -%20
            </div> -->

      <!-- Favorite Button -->
      <button
        @click.prevent="toggleFavorite"
        :disabled="favoritesStore.isLoading"
        class="absolute top-3 right-3 w-[3.75rem] h-[4.75rem] bg-white rounded-[25px] flex items-center justify-center transition-all duration-300 disabled:cursor-not-allowed"
        :class="{
          'text-sacrel-accent': isFavorite,
          'text-gray-400': !isFavorite,
        }"
      >
        <!-- <svg v-if="!favoritesStore.isLoading" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg> -->
        <img
          v-if="!favoritesStore.isLoading && !isFavorite"
          src="/images/sacrel_logo.png"
          alt="sacrel logo"
          class="w-12 h-[3.25rem]"
        />

        <!-- selected sacrel logo -->
        <img
          v-else-if="isFavorite && !favoritesStore.isLoading"
          src="/images/sacrel_logo_accent.png"
          alt="sacrel logo"
          class="w-12 h-[3.25rem]"
        />

        <!-- Loading spinner -->
        <svg
          v-else
          class="w-5 h-5 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </button>

      <!-- Quick Add to Cart (on hover) -->
      <!-- <div class="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
         <Icon @click.prevent="addToCart" name="ic:baseline-add-shopping-cart" class="w-6 h-6 text-black hover:text-gray-700 transition-colors duration-300" /> 
         <button
          @click.prevent="addToCart"
          class="w-full bg-black text-white py-2 px-4 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition duration-300"
        >
          
          Sepete Ekle
        </button>
      </div> -->
    </div>

    <!-- Product Info -->
    <div class="block">
      <div class="p-4">
        <h2
          class="text-sm sm:text-base lg:text-lg font-medium text-black truncate mb-1 sm:mb-2"
        >
          {{ product.title }}
        </h2>

        <!-- <p class="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 line-clamp-2">
                    {{ product.description }}
                </p> -->

        <div class="flex justify-between items-center mt-3 sm:mt-4 lg:mt-0">
          <div class="flex items-center space-x-2">
            <span
              class="text-sm sm:text-base lg:text-lg font-semibold text-black whitespace-nowrap"
            >
              {{ prices[0] }} TL
            </span>

            <!-- <span v-if="prices && prices.length > 0"
                            class="text-xs sm:text-sm text-gray-500 line-through whitespace-nowrap">
                            {{ prices[0] }} TL
                        </span> -->
          </div>

          <!-- Color Options -->
          <div v-if="colors && colors.length > 0" class="flex space-x-1">
            <div
              v-for="color in colors.slice(0, 3)"
              :key="color"
              class="w-4 h-4 rounded-full border border-gray-300"
              :class="productHelper.getColorBgTailwind(color)"
            />
            <span v-if="colors.length > 3" class="text-xs text-gray-500">
              +{{ colors.length - 3 }}
            </span>
          </div>
        </div>

        <!-- Rating (optional) -->
        <!-- <div class="flex items-center mt-2">
          <div class="flex text-yellow-400">
            <svg
              v-for="i in 5"
              :key="i"
              class="w-3 h-3 fill-current"
              :class="i <= (product.rating || 4) ? 'text-yellow-400' : 'text-gray-300'"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <span class="text-xs text-gray-500 ml-1">({{ product.reviewCount || 12 }})</span>
        </div> -->
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { StoreProduct } from "@medusajs/types";

//mock data

const props = defineProps<{
  product: StoreProduct;
}>();
const colors =
  productHelper.extractProductFilters(props.product)["colors"] || [];
const prices =
  productHelper
    .extractProductFilters(props.product)
    ["prices"].map((price: number) => price.toFixed(2)) || [];

console.log("Product Card Props1:", props.product);

// Favorites functionality
const favoritesService = useFavorites();
const favoritesStore = useFavoritesStore();

const isFavorite = computed(() =>
  favoritesStore.isInFavorites(props.product.id)
);

const toggleFavorite = async () => {
  try {
    // Prepare product data for the store
    const productData = {
      title: props.product.title,
      image: props.product.thumbnail || props.product.images?.[0]?.url,
      price:
        props.product.variants?.[0]?.calculated_price?.calculated_amount ||
        parseFloat(prices[0]),
    };

    const wasAdded = await favoritesStore.toggleFavorite(
      props.product.id,
      productData
    );

    // You could add a toast notification here if needed
    console.log(wasAdded ? "Added to favorites" : "Removed from favorites");
  } catch (error) {
    console.error("Error toggling favorite:", error);
  }
};

// Initialize favorites store on component mount
onMounted(() => {
  // Don't initialize here as it's already done in the plugin
  // favoritesStore.initializeFavorites();
});

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  // Use the SVG placeholder instead of a missing file
  target.src = "/images/placeholder.svg";
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.aspect-3-4 {
  aspect-ratio: 3/4;
}
</style>
