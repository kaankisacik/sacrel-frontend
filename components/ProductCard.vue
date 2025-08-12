<template>
  <div class="w-full max-w-sm mx-auto overflow-hidden cursor-pointer group">
    <div class="relative h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px] aspect-3-4 overflow-hidden">
      <!-- Main Product Image -->
      <img
        :src="product.image"
        :alt="product.title"
        class="absolute h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        @error="handleImageError"
      />
      
      <!-- Hover Image -->
      <img
        v-if="product.hoverImage"
        :src="product.hoverImage"
        :alt="`${product.title} Hover`"
        class="absolute inset-0 h-full w-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105"
        @error="handleHoverImageError"
      />

      <!-- Discount Badge -->
      <div
        v-if="discountPercentage > 0"
        class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded"
      >
        -%{{ discountPercentage }}
      </div>

      <!-- Favorite Button -->
      <!-- <button
        @click.prevent="toggleFavorite"
        class="absolute top-3 right-3 w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-300 opacity-0 group-hover:opacity-100"
        :class="{ 'text-red-500': isFavorite, 'text-gray-400': !isFavorite }"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </button> -->

      <!-- Quick Add to Cart (on hover) -->
      <div class="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
        <Icon @click.prevent="addToCart" name="ic:baseline-add-shopping-cart" class="w-6 h-6 text-black hover:text-gray-700 transition-colors duration-300" />
        <!-- <button
          @click.prevent="addToCart"
          class="w-full bg-black text-white py-2 px-4 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition duration-300"
        >
          
          Sepete Ekle
        </button> -->
      </div>
    </div>

    <!-- Product Info -->
    <NuxtLink :to="`/products/${product.id}`" class="block">
      <div class="p-3 sm:p-4 lg:p-6 xl:p-8">
        <h2 class="text-sm sm:text-base lg:text-lg font-medium text-black truncate mb-1 sm:mb-2">
          {{ product.title }}
        </h2>
        
        <p class="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 line-clamp-2">
          {{ product.description }}
        </p>
        
        <div class="flex justify-between items-center mt-3 sm:mt-4 lg:mt-6">
          <div class="flex items-center space-x-2">
            <span class="text-sm sm:text-base lg:text-lg font-semibold text-black whitespace-nowrap">
              {{ formatPrice(product.discountedPrice || product.price) }}
            </span>
            
            <span
              v-if="product.discountedPrice && product.price > product.discountedPrice"
              class="text-xs sm:text-sm text-gray-500 line-through whitespace-nowrap"
            >
              {{ formatPrice(product.price) }}
            </span>
          </div>

          <!-- Color Options -->
          <div v-if="product.colors && product.colors.length > 0" class="flex space-x-1">
            <div
              v-for="color in product.colors.slice(0, 3)"
              :key="color"
              :class="getColorClass(color)"
              class="w-4 h-4 rounded-full border border-gray-300"
              :title="getColorLabel(color)"
            />
            <span
              v-if="product.colors.length > 3"
              class="text-xs text-gray-500"
            >
              +{{ product.colors.length - 3 }}
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
    </NuxtLink>
  </div>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})


console.log(`ProductCard loaded for product: ${props.product.title}`, props.product);


const isFavorite = ref(false)
const isAddingToCart = ref(false)

const discountPercentage = computed(() => {
  if (props.product.discountedPrice && props.product.price > props.product.discountedPrice) {
    return Math.round(((props.product.price - props.product.discountedPrice) / props.product.price) * 100)
  }
  return 0
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(price)
}

const getColorClass = (color) => {
  const colorMap = {
    black: 'bg-black',
    white: 'bg-white',
    gray: 'bg-gray-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    pink: 'bg-pink-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    brown: 'bg-amber-800',
    navy: 'bg-blue-900',
    beige: 'bg-amber-100'
  }

  color = color.toLowerCase()
  return colorMap[color] || 'bg-gray-400'
}

const getColorLabel = (color) => {
  const colorLabels = {
    black: 'Siyah',
    white: 'Beyaz',
    gray: 'Gri',
    red: 'Kırmızı',
    blue: 'Mavi',
    green: 'Yeşil',
    pink: 'Pembe',
    yellow: 'Sarı',
    purple: 'Mor',
    brown: 'Kahverengi',
    navy: 'Lacivert',
    beige: 'Bej'
  }

  color = color.toLowerCase()
  return colorLabels[color] || color
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  console.log('Toggled favorite for:', props.product.title)
}

const addToCart = async () => {
  if (!props.product.variantId) {
    console.warn('No variant ID available for product:', props.product.title)
    return
  }
  
  isAddingToCart.value = true
  try {
    const cartStore = useCartStore()
    await cartStore.addItem(props.product.variantId, 1)
    console.log('Added to cart:', props.product.title)
    
    // Optional: Show success notification
    // Toast notification eklenebilir
  } catch (error) {
    console.error('Error adding to cart:', error)
    // Error notification eklenebilir
  } finally {
    isAddingToCart.value = false
  }
}

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/400x600?text=No+Image'
}

const handleHoverImageError = (event) => {
  event.target.style.display = 'none'
}
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
