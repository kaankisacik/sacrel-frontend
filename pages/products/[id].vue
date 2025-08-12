<template>
  <div class="min-h-screen bg-white">
    <!-- Loading State -->
    <div v-if="isLoading" class="container mx-auto px-4 py-12">
      <div class="flex justify-center items-center min-h-[400px]">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p class="text-gray-600">Ürün yükleniyor...</p>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 py-12">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">Hata Oluştu</h1>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <NuxtLink to="/products" class="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors">
          Ürünlere Dön
        </NuxtLink>
      </div>
    </div>

    <!-- Product Content -->
    <div v-else-if="product" class="min-h-screen bg-white">
      <!-- Breadcrumb -->
      <div class="container mx-auto px-4 py-4">
        <nav class="text-sm text-gray-600">
          <NuxtLink to="/" class="hover:text-black">Anasayfa</NuxtLink>
          <span class="mx-2">/</span>
          <NuxtLink to="/products" class="hover:text-black">Giyim</NuxtLink>
          <span class="mx-2">/</span>
          <span class="text-black">{{ product.title }}</span>
        </nav>
      </div>

      <!-- Product Detail Section -->
      <div class="container mx-auto px-4 pb-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <!-- Product Images -->
          <div class="space-y-4">
            <!-- Main Image -->
            <div class="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                :src="currentImage"
                :alt="product.title"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
            </div>
            
            <!-- Thumbnail Images -->
            <div class="flex space-x-3 overflow-x-auto" v-if="product.images.length > 1">
              <button
                v-for="(image, index) in product.images"
                :key="index"
                @click="currentImage = image"
                class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all"
                :class="currentImage === image ? 'border-black' : 'border-gray-200 hover:border-gray-400'"
              >
                <img
                  :src="image"
                  :alt="`${product.title} ${index + 1}`"
                  class="w-full h-full object-cover"
                />
              </button>
            </div>
          </div>

          <!-- Product Info -->
          <div class="space-y-6">
            <!-- Product Title and Brand -->
            <div>
              <h1 class="text-3xl font-bold text-black mb-2">{{ product.title }}</h1>
              <p class="text-gray-600 uppercase text-sm tracking-wide">{{ product.brand }}</p>
            </div>

            <!-- Price -->
            <div class="flex items-center space-x-3">
              <span class="text-3xl font-bold text-black">{{ formatPrice(currentPrice) }}</span>
              <span v-if="currentOriginalPrice" class="text-lg text-gray-400 line-through">
                {{ formatPrice(currentOriginalPrice) }}
              </span>
              <span v-if="currentDiscount" class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {{ currentDiscount }}% İNDİRİM
              </span>
            </div>

            <!-- Color Selection -->
            <div v-if="product.colors.length > 0" class="space-y-3">
              <div class="flex items-center space-x-2">
                <span class="font-medium">RENK SEÇİMİ:</span>
                <span class="text-sm text-gray-600">({{ selectedColor.name }})</span>
              </div>
              
              <!-- Show out of stock message if no colors are available -->
              <div v-if="availableColors.length === 0" class="text-red-600 font-medium">
                Stok Yok
              </div>
              
              <!-- Color buttons -->
              <div v-else class="flex space-x-3">
                <button
                  v-for="color in product.colors"
                  :key="color.id"
                  @click="isColorAvailable(color) ? selectedColor = color : null"
                  :disabled="!isColorAvailable(color)"
                  class="w-8 h-8 rounded-full border-2 transition-all relative"
                  :class="[
                    selectedColor.id === color.id ? 'border-black' : 'border-gray-300',
                    !isColorAvailable(color) ? 'opacity-30 cursor-not-allowed' : 'hover:border-gray-500 cursor-pointer'
                  ]"
                  :style="{ backgroundColor: color.hex }"
                  :title="isColorAvailable(color) ? color.name : `${color.name} (Stokta Yok)`"
                >
                  <!-- X mark for out of stock colors -->
                  <span v-if="!isColorAvailable(color)" class="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                    ✕
                  </span>
                </button>
              </div>
            </div>

            <!-- Size Selection -->
            <div v-if="product.sizes.length > 0" class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="font-medium">BEDEN SEÇİMİ:</span>
                <button class="text-sm text-gray-600 underline hover:text-black">
                  Beden Tablosu
                </button>
              </div>
              <div class="grid grid-cols-6 gap-2">
                <button
                  v-for="size in product.sizes"
                  :key="size"
                  @click="isSizeAvailableForColor(size) ? selectedSize = size : null"
                  :disabled="!isSizeAvailableForColor(size)"
                  class="py-2 px-3 border rounded transition-all text-sm"
                  :class="[
                    selectedSize === size 
                      ? 'border-black bg-black text-white' 
                      : 'border-gray-300 hover:border-black',
                    !isSizeAvailableForColor(size) 
                      ? 'opacity-50 cursor-not-allowed line-through bg-gray-100' 
                      : 'cursor-pointer'
                  ]"
                >
                  {{ size }}
                </button>
              </div>
              
              <!-- Show available sizes info if color is selected -->
              <div v-if="selectedColor.id && availableSizesForColor.length > 0" class="text-xs text-gray-500">
                Bu renkte mevcut bedenler: {{ availableSizesForColor.join(', ') }}
              </div>
              <div v-else-if="selectedColor.id && availableSizesForColor.length === 0" class="text-xs text-red-500">
                Bu renkte hiç beden bulunmamaktadır.
              </div>
            </div>

            <!-- Product Description -->
            <div class="space-y-2">
              <p class="text-gray-600 text-sm leading-relaxed">
                {{ product.description }}
              </p>
            </div>

            <!-- Quantity and Add to Cart -->
            <div class="space-y-4">
              <div class="flex items-center space-x-4">
                <span class="font-medium">MIKTAR:</span>
                <div class="flex items-center border border-gray-300 rounded">
                  <button
                    @click="decreaseQuantity"
                    :disabled="quantity <= 1"
                    class="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span class="px-4 py-2 min-w-[50px] text-center">{{ quantity }}</span>
                  <button
                    @click="increaseQuantity"
                    class="px-3 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="space-y-3">
                <button
                  @click="addToCart"
                  :disabled="availableColors.length === 0 || (product.sizes && product.sizes.length > 0 && !selectedSize) || (product.colors && product.colors.length > 0 && !selectedColor.id) || !isVariantAvailable"
                  class="w-full bg-black text-white py-4 font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="availableColors.length === 0">
                    STOKTA YOK
                  </span>
                  <span v-else-if="!isVariantAvailable && selectedSize && selectedColor.id">
                    STOKTA YOK
                  </span>
                  <span v-else>
                    SEPETE EKLE
                  </span>
                </button>
                <button
                  @click="toggleFavorite"
                  class="w-full border border-gray-300 py-4 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Icon 
                    :name="isFavorite ? 'mdi:heart' : 'mdi:heart-outline'" 
                    :class="isFavorite ? 'text-red-500' : 'text-gray-600'"
                  />
                  <span>FAVORİLERE EKLE</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Debug Section (temporary) -->
        <div v-if="product.selectedVariant" class="mt-8 p-6 bg-white rounded-xl shadow border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-black flex items-center gap-2">
              <Icon name="mdi:information-outline" class="text-blue-500" />
              Seçili Varyant Bilgileri
            </h3>
            <span class="px-3 py-1 rounded-full text-xs font-semibold"
            :class="isVariantAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
              {{ isVariantAvailable ? 'Stokta Var' : 'Stokta Yok' }}
            </span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="mb-2 flex items-center gap-2">
          <span class="font-semibold text-gray-700">ID:</span>
          <span class="text-gray-900">{{ product.selectedVariant.id }}</span>
              </div>
              <div class="mb-2 flex items-center gap-2">
          <span class="font-semibold text-gray-700">SKU:</span>
          <span class="text-gray-900">{{ product.selectedVariant.sku }}</span>
              </div>
              <div class="mb-2 flex items-center gap-2">
          <span class="font-semibold text-gray-700">Başlık:</span>
          <span class="text-gray-900">{{ product.selectedVariant.title }}</span>
              </div>
              <div class="mb-2 flex items-center gap-2">
          <span class="font-semibold text-gray-700">Stok:</span>
          <span class="text-gray-900">{{ product.selectedVariant.inventory_quantity }}</span>
              </div>
              <div v-if="product.selectedVariant.calculated_price" class="mb-2 flex items-center gap-2">
          <span class="font-semibold text-gray-700">Fiyat:</span>
          <span class="text-gray-900">{{ formatPrice(product.selectedVariant.calculated_price.calculated_amount) }}</span>
              </div>
            </div>
            <div>
              <div v-if="product.selectedVariant.options" class="mb-2">
          <span class="font-semibold text-gray-700">Seçenekler:</span>
          <ul class="ml-2 mt-1 text-gray-800 text-sm">
            <li v-for="option in product.selectedVariant.options" :key="option.id">
              <span class="font-medium">{{ option.option?.title }}:</span> {{ option.value }}
            </li>
          </ul>
              </div>
              <div class="mb-2">
          <span class="font-semibold text-gray-700">Mevcut Renkler:</span>
          <span class="ml-1 text-gray-900">{{ availableColors.length }} / {{ product.colors.length }}</span>
              </div>
              <div class="mb-2">
          <span class="font-semibold text-gray-700">Seçili Renk için Mevcut Bedenler:</span>
          <span class="ml-1 text-gray-900">{{ availableSizesForColor.length }}</span>
              </div>
            </div>
          </div>
          <div v-if="selectedColor.id" class="mt-4">
            <div class="font-semibold text-gray-700 mb-1 flex items-center gap-2">
              <span>Stok Durumu:</span>
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs"
              :style="{ backgroundColor: selectedColor.hex, color: '#fff' }">
          {{ selectedColor.name }}
              </span>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div v-for="size in product.sizes" :key="size"
             class="flex items-center gap-2 px-2 py-1 rounded border"
             :class="isSizeAvailableForColor(size) ? 'border-green-400 bg-green-50 text-green-700' : 'border-red-400 bg-red-50 text-red-700 opacity-70'">
          <span class="font-medium">{{ size }}</span>
          <span>{{ isSizeAvailableForColor(size) ? 'Var' : 'Yok' }}</span>
              </div>
            </div>
          </div>
          <div class="mt-6">
            <span class="font-semibold text-gray-700">Renk-Beden Haritası:</span>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <div v-for="color in product.colors" :key="color.id" class="flex items-center gap-2">
          <span class="inline-block w-4 h-4 rounded-full border" :style="{ backgroundColor: color.hex }"></span>
          <span class="font-medium">{{ color.name }}:</span>
          <span v-if="byColorSizesMapRef.get(color.id)">
            <span class="text-gray-800">{{ Array.from(byColorSizesMapRef.get(color.id) || []).join(', ') }}</span>
          </span>
          <span v-else class="text-red-500">Hiç beden yok</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Reviews Section -->
        <div class="mt-16 border-t pt-12">
          <h2 class="text-2xl font-bold mb-8">Müşteri Değerlendirmeleri</h2>
          
          <div class="space-y-6">
            <div v-for="review in reviews" :key="review.id" class="border-b pb-6">
              <div class="flex items-center space-x-3 mb-3">
                <div class="flex text-yellow-400">
                  <Icon 
                    v-for="i in 5" 
                    :key="i" 
                    name="mdi:star" 
                    :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                  />
                </div>
                <span class="font-medium">{{ review.customerName }}</span>
                <span class="text-sm text-gray-500">{{ formatDate(review.date) }}</span>
              </div>
              <p class="text-gray-700">{{ review.comment }}</p>
            </div>
          </div>

          <button class="mt-8 text-center w-full py-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            DEĞERLENDIRMELER YAP
          </button>
        </div>

        <!-- Similar Products -->
        <div v-if="similarProducts.length > 0" class="mt-16">
          <h2 class="text-2xl font-bold mb-8">Benzer Ürünler</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <NuxtLink 
              v-for="similarProduct in similarProducts" 
              :key="similarProduct.id" 
              :to="`/products/${similarProduct.id}`"
              class="group cursor-pointer"
            >
              <div class="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-3">
                <img
                  :src="similarProduct.image"
                  :alt="similarProduct.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 class="font-medium text-sm mb-1">{{ similarProduct.title }}</h3>
              <p class="text-sm text-gray-600 mb-1">{{ similarProduct.description }}</p>
              <div class="flex items-center space-x-2">
                <span class="font-bold">{{ formatPrice(similarProduct.price) }}</span>
                <span v-if="similarProduct.originalPrice" class="text-xs text-gray-400 line-through">
                  {{ formatPrice(similarProduct.originalPrice) }}
                </span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Color {
  id: string
  name: string
  hex: string
  inventory?: number
}

interface Product {
  id: string
  title: string
  brand: string
  price: number
  originalPrice?: number
  discount?: number
  description: string
  images: string[]
  colors: Color[]
  sizes: string[]
  availableSizes: string[]
  variants?: any[]
  selectedVariant?: any
}

interface Review {
  id: string
  customerName: string
  rating: number
  comment: string
  date: string
}

interface SimilarProduct {
  id: string
  title: string
  description: string
  image: string
  price: number
  originalPrice?: number
}

// Router and route
const route = useRoute()
const router = useRouter()

// Composables
const { getProduct, getProducts } = useProducts()
const cartStore = useCartStore()
const { countryCode } = useCountry()

// Helper function to format price
const formatPrice = (price: number) => {
  // Medusa stores prices in cents, so divide by 100
  const actualPrice = typeof price === 'number' ? price  : 0
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(actualPrice)
}

// Reactive data
const currentImage = ref<string>('')
const selectedColor = ref<Color>({ id: '', name: '', hex: '' })
const selectedSize = ref<string>('')
const quantity = ref<number>(1)
const isFavorite = ref<boolean>(false)
const isLoading = ref<boolean>(true)
const product = ref<Product | null>(null)
const error = ref<string>('')
const colorSizeInventoryMap = ref<Map<string, number>>(new Map())
const byColorAvailabilityMap = ref<Map<string, boolean>>(new Map())
const byColorSizesMapRef = ref<Map<string, Set<string>>>(new Map())

// Helper function to get color mapping
const getColorMapping = (optionValue: string): Color => {
  const colorMappings: { [key: string]: Omit<Color, 'inventory'> } = {
    'black': { id: 'black', name: 'Siyah', hex: '#000000' },
    'white': { id: 'white', name: 'Beyaz', hex: '#FFFFFF' },
    'red': { id: 'red', name: 'Kırmızı', hex: '#FF0000' },
    'blue': { id: 'blue', name: 'Mavi', hex: '#0000FF' },
    'green': { id: 'green', name: 'Yeşil', hex: '#008000' },
    'yellow': { id: 'yellow', name: 'Sarı', hex: '#FFFF00' },
    'pink': { id: 'pink', name: 'Pembe', hex: '#FFC0CB' },
    'purple': { id: 'purple', name: 'Mor', hex: '#800080' },
    'gray': { id: 'gray', name: 'Gri', hex: '#808080' },
    'brown': { id: 'brown', name: 'Kahverengi', hex: '#A52A2A' },
    'navy': { id: 'navy', name: 'Lacivert', hex: '#000080' },
    'beige': { id: 'beige', name: 'Bej', hex: '#F5F5DC' }
  }
  
  const lowerValue = optionValue.trim().toLowerCase()
  const baseColor = colorMappings[lowerValue] || { id: lowerValue, name: optionValue, hex: '#808080' }
  return { ...baseColor, inventory: 0 }
}

// Helper function to get color ID from option value
const getColorId = (optionValue: string): string => {
  return optionValue.trim().toLowerCase()
}

// Transform Medusa product to our Product interface
const transformMedusaProduct = (medusaProduct: any): Product => {
  const images = medusaProduct.images?.map((img: any) => img.url) || ['/images/placeholder.jpg']
  
  // Extract colors and sizes from variants with proper validation
  const colors: Color[] = []
  const sizes: string[] = []
  const availableSizes: string[] = []
  
  if (medusaProduct.variants && medusaProduct.variants.length > 0) {
    // Create maps to track inventory and availability
    const colorSet = new Set<string>()
    const sizeSet = new Set<string>()
    const colorInventoryMap = new Map<string, number>() // Total inventory per color
    const inventoryMap = new Map<string, number>() // Inventory per color-size combination
    const availabilityMap = new Map<string, boolean>() // Availability per color-size combination
    const byColorSizesMap = new Map<string, Set<string>>() // Available sizes per color
    
    // Helper function to check if variant is available
    const isVariantAvailable = (variant: any): boolean => {
      return variant.allow_backorder === true || 
             variant.manage_inventory === false || 
             (variant.inventory_quantity && variant.inventory_quantity > 0)
    }
    
    // Helper function to normalize option values
    const normalizeValue = (value: string): string => {
      return value.trim().toLowerCase()
    }
    
    // Helper function to validate option consistency
    const validateOptionConsistency = (variant: any, extractedColor: string, extractedSize: string) => {
      if (variant.title) {
        const titleLower = variant.title.toLowerCase()
        const colorLower = extractedColor.toLowerCase()
        const sizeLower = extractedSize.toLowerCase()
        
        // Check if title contains the extracted values
        const titleContainsColor = titleLower.includes(colorLower)
        const titleContainsSize = titleLower.includes(sizeLower)
        
        if ((extractedColor && !titleContainsColor) || (extractedSize && !titleContainsSize)) {
          console.warn(`Data inconsistency in variant ${variant.id}:`, {
            title: variant.title,
            extractedColor,
            extractedSize,
            message: 'Using options data as source of truth'
          })
        }
      }
    }
    
    medusaProduct.variants.forEach((variant: any) => {
      let variantColor = ''
      let variantSize = ''
      let colorOptionFound = false
      let sizeOptionFound = false
      
      // Extract color and size from variant options with validation
      variant.options?.forEach((option: any) => {
        const optionTitle = normalizeValue(option.option?.title || '')
        const optionValue = option.value ? option.value.trim() : ''
        
        // Validate option consistency with product options
        const productOption = medusaProduct.options?.find((po: any) => po.id === option.option_id)
        if (!productOption) {
          console.warn(`Option consistency error: option_id ${option.option_id} not found in product options`)
        }
        
        if (optionTitle === 'color' || optionTitle === 'renk') {
          variantColor = getColorId(optionValue)
          colorSet.add(variantColor)
          colorOptionFound = true
        }
        
        if (optionTitle === 'size' || optionTitle === 'beden') {
          variantSize = optionValue
          sizeSet.add(optionValue)
          sizeOptionFound = true
        }
      })
      
      // Validate data consistency
      if (colorOptionFound && sizeOptionFound) {
        validateOptionConsistency(variant, variantColor, variantSize)
      }
      
      // Calculate availability
      const isAvailable = isVariantAvailable(variant)
      
      // Track inventory and availability for color and color-size combinations
      if (variantColor) {
        const currentColorInventory = colorInventoryMap.get(variantColor) || 0
        const inventoryToAdd = isAvailable ? (variant.inventory_quantity || 0) : 0
        colorInventoryMap.set(variantColor, currentColorInventory + inventoryToAdd)
        
        if (variantSize) {
          const colorSizeKey = `${variantColor}-${variantSize}`
          inventoryMap.set(colorSizeKey, variant.inventory_quantity || 0)
          availabilityMap.set(colorSizeKey, isAvailable)
          
          // Track available sizes per color
          if (isAvailable) {
            if (!byColorSizesMap.has(variantColor)) {
              byColorSizesMap.set(variantColor, new Set())
            }
            byColorSizesMap.get(variantColor)!.add(variantSize)
          }
        }
      }
    })
    
    // Convert sets to arrays and filter colors based on availability
    colorSet.forEach(colorId => {
      const hasAvailableSizes = byColorSizesMap.has(colorId) && byColorSizesMap.get(colorId)!.size > 0
      
      // Only include colors that have available sizes
      if (hasAvailableSizes) {
        // Find the original color value to get proper display name
        let originalColorValue = colorId
        medusaProduct.variants.forEach((variant: any) => {
          variant.options?.forEach((option: any) => {
            const optionTitle = normalizeValue(option.option?.title || '')
            if ((optionTitle === 'color' || optionTitle === 'renk') && 
                getColorId(option.value) === colorId) {
              originalColorValue = option.value
            }
          })
        })
        
        const color = getColorMapping(originalColorValue)
        const colorInventory = colorInventoryMap.get(colorId) || 0
        colors.push({ ...color, inventory: colorInventory, id: colorId })
      }
    })
    
    sizes.push(...Array.from(sizeSet))
    
    // Sort sizes in a logical order
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    sizes.sort((a, b) => {
      const aIndex = sizeOrder.indexOf(a)
      const bIndex = sizeOrder.indexOf(b)
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b)
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })
    
    // Store the maps for later use
    colorSizeInventoryMap.value = inventoryMap
    byColorAvailabilityMap.value = availabilityMap
    byColorSizesMapRef.value = byColorSizesMap
  }

  // Find a variant with calculated price for pricing info
  const variantWithPrice = medusaProduct.variants?.find((v: any) => v.calculated_price) || medusaProduct.variants?.[0]
  const price = variantWithPrice?.calculated_price?.calculated_amount || 0
  const originalPrice = variantWithPrice?.calculated_price?.original_amount || 0
  const discount = originalPrice > price ? 
    Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return {
    id: medusaProduct.id,
    title: medusaProduct.title || 'Ürün',
    brand: medusaProduct.collection?.title || 'SACREL',
    price: price,
    originalPrice: originalPrice > price ? originalPrice : undefined,
    discount: discount > 0 ? discount : undefined,
    description: medusaProduct.description || '',
    images: images,
    colors: colors,
    sizes: sizes,
    availableSizes: availableSizes,
    variants: medusaProduct.variants || [],
    selectedVariant: variantWithPrice || medusaProduct.variants?.[0]
  }
}

// Load product data
const loadProduct = async () => {
  try {
    isLoading.value = true
    error.value = ''
    
    const productId = route.params.id as string
    const medusaProduct = await getProduct(productId)
    
    if (!medusaProduct) {
      error.value = 'Ürün bulunamadı'
      return
    }

    console.log('Loaded product:', medusaProduct);
    
    
    product.value = transformMedusaProduct(medusaProduct)
    
    // Set initial values
    if (product.value.images && product.value.images.length > 0) {
      currentImage.value = product.value.images[0] || '/images/placeholder.jpg'
    }
    
    // Auto-select first available color with proper fallback logic
    const firstAvailableColor = availableColors.value.find(color => isColorAvailable(color))
    if (firstAvailableColor) {
      selectedColor.value = firstAvailableColor
      
      // Auto-select first available size for the selected color
      if (availableSizesForColor.value && availableSizesForColor.value.length > 0) {
        selectedSize.value = availableSizesForColor.value[0]!
      } else {
        selectedSize.value = ''
      }
    } else {
      // No colors available
      selectedColor.value = { id: '', name: '', hex: '' }
      selectedSize.value = ''
      console.warn('No available colors found for product:', product.value.id)
    }
    
  } catch (err) {
    console.error('Error loading product:', err)
    error.value = 'Ürün yüklenirken bir hata oluştu'
  } finally {
    isLoading.value = false
  }
}

const reviews = ref<Review[]>([
  {
    id: '1',
    customerName: 'Ayşe Yılmaz',
    rating: 5,
    comment: 'Harika ürün, çok kaliteli ve kalıbı tam oturuyor.',
    date: '2024-01-15'
  },
  {
    id: '2',
    customerName: 'Mehmet Kaya',
    rating: 4,
    comment: 'Kumaşı yumuşak ve rahat. Kesinette tavsiye ederim.',
    date: '2024-01-10'
  },
  {
    id: '3',
    customerName: 'Zeynep Demir',
    rating: 5,
    comment: 'Beklediğimden daha güzel. Çok memnun kaldım.',
    date: '2024-01-08'
  }
])

const similarProducts = ref<SimilarProduct[]>([])

// Load similar products
const loadSimilarProducts = async () => {
  try {
    const { products } = await getProducts({ limit: 4 })
    similarProducts.value = products
      .filter((p: any) => p.id !== product.value?.id)
      .slice(0, 4)
      .map((p: any) => {
        const variant = p.variants?.[0]
        const price = variant?.calculated_price?.calculated_amount ? 
          variant.calculated_price.calculated_amount  : 0
        const originalPrice = variant?.calculated_price?.original_amount ? 
          variant.calculated_price.original_amount  : price
        
        return {
          id: p.id,
          title: p.title,
          description: p.description || '',
          image: p.images?.[0]?.url || '/images/placeholder.jpg',
          price: variant?.calculated_price?.calculated_amount || 0,
          originalPrice: (variant?.calculated_price?.original_amount || 0) > (variant?.calculated_price?.calculated_amount || 0) ? 
            variant?.calculated_price?.original_amount : undefined
        }
      })
  } catch (err) {
    console.error('Error loading similar products:', err)
  }
}

// Find the selected variant based on color and size
const findSelectedVariant = () => {
  if (!product.value?.variants || product.value.variants.length === 0) return null
  
  // If no color or size is selected, return the first available variant
  if (!selectedColor.value.id && !selectedSize.value) {
    return product.value.variants.find((variant: any) => {
      return variant.allow_backorder === true || 
             variant.manage_inventory === false || 
             (variant.inventory_quantity && variant.inventory_quantity > 0)
    }) || product.value.variants[0]
  }
  
  // Helper function to normalize values for comparison
  const normalizeValue = (value: string): string => {
    return value.trim().toLowerCase()
  }
  
  return product.value.variants.find((variant: any) => {
    let matchesColor = true
    let matchesSize = true
    
    // Check if variant matches selected color
    if (selectedColor.value.id) {
      matchesColor = variant.options?.some((option: any) => {
        const optionTitle = normalizeValue(option.option?.title || '')
        const optionValue = normalizeValue(option.value || '')
        const selectedColorNormalized = normalizeValue(selectedColor.value.id)
        
        return (optionTitle === 'color' || optionTitle === 'renk') &&
               optionValue === selectedColorNormalized
      })
    }
    
    // Check if variant matches selected size
    if (selectedSize.value) {
      matchesSize = variant.options?.some((option: any) => {
        const optionTitle = normalizeValue(option.option?.title || '')
        const optionValue = normalizeValue(option.value || '')
        const selectedSizeNormalized = normalizeValue(selectedSize.value)
        
        return (optionTitle === 'size' || optionTitle === 'beden') &&
               optionValue === selectedSizeNormalized
      })
    }
    
    return matchesColor && matchesSize
  }) || product.value.variants[0]
}

// Update selected variant when color or size changes
watch([selectedColor, selectedSize], () => {
  if (product.value) {
    product.value.selectedVariant = findSelectedVariant()
    console.log('Selected variant:', product.value.selectedVariant)
  }
})

// Watch for color changes to auto-select first available size
watch(selectedColor, (newColor, oldColor) => {
  // If the new color is not available, find the next available color
  if (newColor.id && !isColorAvailable(newColor)) {
    const nextAvailableColor = availableColors.value.find(color => color.id !== newColor.id)
    if (nextAvailableColor) {
      console.warn(`Selected color ${newColor.name} is not available, switching to ${nextAvailableColor.name}`)
      selectedColor.value = nextAvailableColor
      return
    } else {
      console.warn('No available colors found')
      selectedColor.value = { id: '', name: '', hex: '' }
      selectedSize.value = ''
      return
    }
  }
  
  // Auto-select first available size for the selected color
  if (newColor.id && availableSizesForColor.value.length > 0) {
    selectedSize.value = availableSizesForColor.value[0]!
  } else if (newColor.id) {
    selectedSize.value = ''
  }
}, { deep: true })

// Computed property for current price based on selected variant
const currentPrice = computed(() => {
  const variant = product.value?.selectedVariant
  return variant?.calculated_price?.calculated_amount || product.value?.price || 0
})

// Computed property for current original price based on selected variant
const currentOriginalPrice = computed(() => {
  const variant = product.value?.selectedVariant
  const originalAmount = variant?.calculated_price?.original_amount || 0
  const calculatedAmount = variant?.calculated_price?.calculated_amount || 0
  return originalAmount > calculatedAmount ? originalAmount : null
})

// Computed property for current discount
const currentDiscount = computed(() => {
  const original = currentOriginalPrice.value
  const current = currentPrice.value
  if (original && original > current) {
    return Math.round(((original - current) / original) * 100)
  }
  return null
})

// Computed property for variant availability
const isVariantAvailable = computed(() => {
  const variant = product.value?.selectedVariant
  if (!variant) return false
  
  return variant.allow_backorder === true || 
         variant.manage_inventory === false || 
         (variant.inventory_quantity && variant.inventory_quantity > 0)
})

// Computed property for available sizes based on selected color
const availableSizesForColor = computed(() => {
  if (!product.value?.sizes || !selectedColor.value.id) {
    return product.value?.sizes || []
  }
  
  // Use the byColorSizesMapRef to get available sizes for the selected color
  const availableSizesSet = byColorSizesMapRef.value.get(selectedColor.value.id)
  if (!availableSizesSet) {
    return []
  }
  
  // Filter and sort the available sizes
  const availableSizes = Array.from(availableSizesSet)
  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  
  return availableSizes.sort((a, b) => {
    const aIndex = sizeOrder.indexOf(a)
    const bIndex = sizeOrder.indexOf(b)
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b)
    if (aIndex === -1) return 1
    if (bIndex === -1) return -1
    return aIndex - bIndex
  })
})

// Computed property for available colors (colors with available sizes)
const availableColors = computed(() => {
  if (!product.value?.colors) return []
  
  return product.value.colors.filter(color => {
    const availableSizesSet = byColorSizesMapRef.value.get(color.id)
    return availableSizesSet && availableSizesSet.size > 0
  })
})

// Helper function to check if a color has any available sizes
const isColorAvailable = (color: Color): boolean => {
  const availableSizesSet = byColorSizesMapRef.value.get(color.id)
  return availableSizesSet ? availableSizesSet.size > 0 : false
}

// Helper function to check if a size is available for the selected color
const isSizeAvailableForColor = (size: string): boolean => {
  if (!selectedColor.value.id) return true
  
  const colorSizeKey = `${selectedColor.value.id}-${size}`
  return byColorAvailabilityMap.value.get(colorSizeKey) || false
}

// Methods
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/images/placeholder.jpg'
}

const increaseQuantity = () => {
  quantity.value++
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = async () => {
  // Check if any colors are available
  if (availableColors.value.length === 0) {
    alert('Bu ürün şu anda stokta bulunmamaktadır.')
    return
  }
  
  // Check if color and size are required and selected
  if (product.value?.colors && product.value.colors.length > 0 && !selectedColor.value.id) {
    alert('Lütfen renk seçiniz.')
    return
  }
  
  if (product.value?.sizes && product.value.sizes.length > 0 && !selectedSize.value) {
    alert('Lütfen beden seçiniz.')
    return
  }
  
  if (!product.value?.selectedVariant) {
    alert('Seçilen ürün varyantı bulunamadı.')
    return
  }
  
  if (!isVariantAvailable.value) {
    alert('Seçilen varyant stokta bulunmamaktadır.')
    return
  }
  
  try {
    await cartStore.addToCart({
      variantId: product.value.selectedVariant.id,
      quantity: quantity.value,
      countryCode: countryCode.value || 'tr'
    })
    alert('Ürün sepete eklendi!')
  } catch (error) {
    console.error('Error adding to cart:', error)
    alert('Ürün sepete eklenirken bir hata oluştu.')
  }
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  console.log('Toggle favorite:', product.value?.id, isFavorite.value)
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR')
}

// Lifecycle
onMounted(async () => {
  await loadProduct()
  await loadSimilarProducts()
})

// Watch for route changes
watch(() => route.params.id, async (newId) => {
  if (newId) {
    await loadProduct()
    await loadSimilarProducts()
  }
})

// SEO
useHead(() => ({
  title: product.value ? `${product.value.title} - SACREL` : 'Ürün Detayı - SACREL',
  meta: [
    {
      name: 'description',
      content: product.value?.description || 'SACREL ürün detayı'
    },
    {
      property: 'og:title',
      content: product.value ? `${product.value.title} - SACREL` : 'Ürün Detayı - SACREL'
    },
    {
      property: 'og:description',
      content: product.value?.description || 'SACREL ürün detayı'
    },
    {
      property: 'og:image',
      content: currentImage.value || '/images/placeholder.jpg'
    }
  ]
}))
</script>

<style scoped>
/* Additional custom styles if needed */
.aspect-3-4 {
  aspect-ratio: 3/4;
}

.aspect-square {
  aspect-ratio: 1/1;
}
</style>
