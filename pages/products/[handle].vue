<template>
  <div class="min-h-screen bg-white">
    <!-- Loading State -->
    <div v-if="isLoading" class="container mx-auto px-4 py-12">
      <div class="flex justify-center items-center min-h-[400px]">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p class="text-gray-600">Loading product...</p>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 py-12">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">Error Occurred</h1>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <NuxtLink to="/products" class="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors">
          Back to Products
        </NuxtLink>
      </div>
    </div>

    <!-- Product Content -->
    <div v-else-if="product?.product" class="min-h-screen bg-white">
      <!-- Breadcrumb -->
      <div class="container mx-auto px-4 py-4">
        <nav class="text-sm text-gray-600">
          <NuxtLink to="/" class="hover:text-black">Anasayfa</NuxtLink>
          <span class="mx-2">/</span>
          <NuxtLink to="/products" class="hover:text-black">Ürünler</NuxtLink>
          <span class="mx-2">/</span>
          <span class="text-black">{{ product?.product?.title }}</span>
        </nav>
      </div>

      <!-- Product Detail Section -->
      <div class="container mx-auto px-4 pb-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <!-- Product Images -->
          <div class="space-y-4">
            <!-- Main Image -->
            <div class="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img :src="currentImage" :alt="product?.product?.title" class="w-full h-full object-cover" />
            </div>

            <!-- Thumbnail Images -->
            <div class="flex space-x-3 overflow-x-auto" v-if="productImages.length > 1">
              <button v-for="(image, index) in productImages" :key="index" @click="currentImage = image"
                class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all"
                :class="currentImage === image ? 'border-black' : 'border-gray-200 hover:border-gray-400'">
                <img :src="image" :alt="`${product?.product?.title} ${index + 1}`" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Product Info -->
          <div class="space-y-6">
            <!-- Product Title and Brand -->
            <div>
              <h1 class="text-3xl font-bold text-black mb-2">{{ product?.product?.title }}</h1>
              <p class="text-gray-600 uppercase text-sm tracking-wide">{{ product?.product?.subtitle || 'SACREL' }}</p>
            </div>

            <!-- Price -->
            <div class="flex items-center space-x-3">
              <span class="text-3xl font-bold text-black">{{ productPrice }} TL</span>
              <span v-if="productOriginalPrice" class="text-lg text-gray-400 line-through">
                ${{ productOriginalPrice }}
              </span>
              <span v-if="productDiscount" class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                %{{ productDiscount }} İndirim
              </span>
            </div>

            <!-- Color Selection -->
            <div v-if="productColors.length > 0" class="space-y-3">
              <div class="flex items-center space-x-2">
                <span class="font-medium">Renk:</span>
                <span class="text-sm text-gray-600">({{ selectedColor.name }})</span>
              </div>

              <div class="flex space-x-3">
                <button v-for="color in productColors" :key="color.id" @click="selectedColor = color"
                  :disabled="!color.isAvailable"
                  class="w-8 h-8 rounded-full border-2 transition-all cursor-pointer relative" :class="[
                    selectedColor.id === color.id ? 'border-black' : 'border-gray-300 hover:border-gray-500',
                    color.class,
                    !color.isAvailable ? 'opacity-50 cursor-not-allowed' : ''
                  ]" :title="color.name + (color.isAvailable ? '' : ' (Stokta Yok)')">
                  <!-- Çizgi stokta olmayan renkler için -->
                  <span v-if="!color.isAvailable" class="absolute inset-0 flex items-center justify-center">
                    <span class="w-full h-0.5 bg-gray-400 transform rotate-45"></span>
                  </span>
                </button>
              </div>
            </div>

            <!-- Size Selection -->
            <div v-if="productSizes.length > 0" class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="font-medium">Beden:</span>
                <!-- <button class="text-sm text-gray-600 underline hover:text-black">
                  Size Guide
                </button> -->
              </div>
              <div class="grid grid-cols-6 gap-2">
                <button v-for="size in productSizes" :key="size.value" @click="selectedSize = size.value"
                  :disabled="!size.isAvailable"
                  class="py-2 px-3 border rounded transition-all text-sm cursor-pointer relative" :class="[
                    selectedSize === size.value ? 'border-black bg-black text-white' : 'border-gray-300 hover:border-black',
                    !size.isAvailable ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                  ]" :title="size.value + (size.isAvailable ? '' : ' (Bu renkte stokta yok)')">
                  {{ size.value }}
                  <!-- Çizgi stokta olmayan bedenler için -->
                  <span v-if="!size.isAvailable" class="absolute inset-0 flex items-center justify-center">
                    <span class="w-full h-0.5 bg-gray-400 transform rotate-45"></span>
                  </span>
                </button>
              </div>
            </div>

            <!-- Product Description -->
            <div class="space-y-2">
              <p class="text-gray-600 text-sm leading-relaxed">
                {{ product?.product?.description }}
              </p>
            </div>

            <!-- Quantity and Add to Cart -->
            <div class="space-y-4">
              <div class="flex items-center space-x-4">
                <span class="font-medium">Adet:</span>
                <div class="flex items-center border border-gray-300 rounded">
                  <button @click="quantity = Math.max(1, quantity - 1)" :disabled="quantity <= 1"
                    class="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                    -
                  </button>
                  <span class="px-4 py-2 min-w-[50px] text-center">{{ quantity }}</span>
                  <button @click="increaseQuantity" :disabled="!selectedVariant || quantity >= maxAddableQuantity"
                    class="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                    +
                  </button>
                </div>
                <div v-if="selectedVariant" class="text-sm text-gray-500">
                  <div>(Stok: {{ selectedVariant.inventory_quantity }})</div>

                </div>
              </div>

              <!-- Action Buttons -->
              <div class="space-y-3">
                <!-- Farklı durumlar için mesajlar -->
                <div v-if="!isProductInStock" class="text-center py-4 bg-red-50 rounded border border-red-200">
                  <p class="text-red-600 font-medium">Bu ürün şu anda stokta bulunmamaktadır.</p>
                </div>

                <div v-else-if="maxAddableQuantity === 0"
                  class="text-center py-4 bg-orange-50 rounded border border-orange-200">
                  <p class="text-orange-600 font-medium">Bu üründen sepetinizde maksimum miktar bulunmaktadır.</p>
                </div>

                <button v-else @click="addToCart" :disabled="!canAddToCart"
                  class="w-full py-4 font-medium transition-colors" :class="canAddToCart
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'">
                  {{ canAddToCart ? 'Sepete Ekle' : 'Sepete Eklenemez' }}
                </button>

                <button @click="toggleFavorite"
                  class="w-full border border-gray-300 py-4 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <span :class="isFavorite ? 'text-red-500' : 'text-gray-600'">♥</span>
                  <span>
                    {{ isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle' }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mü Section -->
        <div class="mt-16 border-t pt-12">
          <h2 class="text-2xl font-bold mb-8">Müşteri Yorumları</h2>

          <div class="space-y-6">
            <div v-for="review in reviews" :key="review.id" class="border-b pb-6">
              <div class="flex items-center space-x-3 mb-3">
                <div class="flex text-yellow-400">
                  <span v-for="i in 5" :key="i" :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'">
                    ★
                  </span>
                </div>
                <span class="font-medium">{{ review.customerName }}</span>
                <span class="text-sm text-gray-500">{{ review.date }}</span>
              </div>
              <p class="text-gray-700">{{ review.comment }}</p>
            </div>
          </div>

          <button
            class="mt-8 text-center w-full py-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            Yorum Yaz
          </button>
        </div>

        <!-- Benzer Ürünler -->
        <div v-if="similarProducts.length > 0" class="mt-16">
          <h2 class="text-2xl font-bold mb-8">Benzer Ürünler</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <NuxtLink v-for="similarProduct in similarProducts" :key="similarProduct.id"
              :to="`/products/${similarProduct.id}`" class="group cursor-pointer">
              <div class="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-3">
                <img :src="similarProduct.image" :alt="similarProduct.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <h3 class="font-medium text-sm mb-1">{{ similarProduct.title }}</h3>
              <p class="text-sm text-gray-600 mb-1">{{ similarProduct.description }}</p>
              <div class="flex items-center space-x-2">
                <span class="font-bold">${{ similarProduct.price }}</span>
                <span v-if="similarProduct.originalPrice" class="text-xs text-gray-400 line-through">
                  ${{ similarProduct.originalPrice }}
                </span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Get route parameter
const route = useRoute()
const handle = route.params.handle

// Store references
const productStore = useProductStore()
const cartStore = useCartStore()
const { product } = storeToRefs(productStore)

// Reactive state
const isLoading = ref(true)
const error = ref('')
const quantity = ref(1)
const isFavorite = ref(false)
const currentImage = ref('')
const selectedColor = ref({ id: '', name: '', class: '', isAvailable: true })
const selectedSize = ref('')
const selectedVariant = ref(null)
const isInitializing = ref(false)

// Computed properties for product data
const productImages = computed(() => {
  if (!product.value?.product?.images) return []
  return product.value.product.images.map((img) => img.url)
})

const productColors = computed(() => {
  if (!product.value?.product?.options) return []
  const colorOption = product.value.product.options.find((opt) =>
    opt.title.toLowerCase() === 'color'
  )
  return colorOption?.values?.map((val) => ({
    id: val.id,
    name: val.value,
    class: productHelper.getColorBgTailwind(val.value.toLowerCase()),
    isAvailable: productHelper.getAvailableSizesForColor(product.value?.product, val.value).length > 0
  })) || []
})

const productSizes = computed(() => {
  if (!product.value?.product?.options) return []
  const sizeOption = product.value.product.options.find((opt) =>
    opt.title.toLowerCase() === 'size'
  )
  return sizeOption?.values?.map((val) => ({
    value: val.value,
    isAvailable: selectedColor.value.name ?
      productHelper.getAvailableSizesForColor(product.value?.product, selectedColor.value.name).includes(val.value) :
      productHelper.getAvailableColorsForSize(product.value?.product, val.value).length > 0
  })) || []
})

// Ürün stok durumu
const isProductInStock = computed(() => {
  return product.value?.product ? productHelper.isProductInStock(product.value.product) : false
})

// Sepetteki mevcut miktar
const currentQuantityInCart = computed(() => {
  if (!cartStore.cart?.cart?.items || !selectedVariant.value) return 0

  const existingItem = cartStore.cart.cart.items.find(
    item => item.variant_id === selectedVariant.value?.id
  )

  return existingItem ? existingItem.quantity : 0
})

// Maksimum eklenebilir miktar
const maxAddableQuantity = computed(() => {
  if (!selectedVariant.value) return 0
  return Math.max(0, selectedVariant.value.inventory_quantity - currentQuantityInCart.value)
})

// Sepete ekleme butonunun durumu
const canAddToCart = computed(() => {
  return selectedVariant.value &&
    selectedVariant.value.inventory_quantity > 0 &&
    maxAddableQuantity.value > 0 &&
    quantity.value <= maxAddableQuantity.value
})

const productPrice = computed(() => {
  if (selectedVariant.value?.calculated_price) {
    return (selectedVariant.value.calculated_price.calculated_amount).toFixed(2)
  }
  if (product.value?.product?.variants?.[0]?.calculated_price) {
    return (product.value.product.variants[0].calculated_price.calculated_amount).toFixed(2)
  }
  return '0.00'
})

const productOriginalPrice = computed(() => {
  if (selectedVariant.value?.calculated_price?.original_amount) {
    const original = selectedVariant.value.calculated_price.original_amount
    const current = selectedVariant.value.calculated_price.calculated_amount
    return original > current ? original.toFixed(2) : null
  }
  return null
})

const productDiscount = computed(() => {
  if (productOriginalPrice.value && productPrice.value) {
    const original = parseFloat(productOriginalPrice.value)
    const current = parseFloat(productPrice.value)
    return Math.round(((original - current) / original) * 100)
  }
  return null
})

// Sample reviews data (you can implement real reviews later)
const reviews = ref([
  {
    id: '1',
    customerName: 'John Doe',
    rating: 5,
    comment: 'Great quality product, fits perfectly!',
    date: '2024-01-15'
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    rating: 4,
    comment: 'Nice material and comfortable.',
    date: '2024-01-10'
  }
])

// Similar products (you can implement real similar products later)
const similarProducts = computed(() => {
  // This would typically come from your product store
  return []
})

// Watch for color changes and update available sizes
// Watch for color changes and update available sizes
watch(selectedColor, (newColor, oldColor) => {
  // İlk yükleme sırasında watch'ı tetikleme
  if (isInitializing.value || (!oldColor.name && newColor.name)) return

  if (product.value?.product && newColor.name) {
    // Renk değiştiğinde ilk mevcut bedeni seç
    const firstAvailableSize = productHelper.getFirstAvailableSize(product.value.product, newColor.name)
    if (firstAvailableSize) {
      selectedSize.value = firstAvailableSize
    } else {
      selectedSize.value = ''
    }
  }
})

// Watch for variant selection changes
// Watch for variant selection changes
watch([selectedColor, selectedSize], ([newColor, newSize], [oldColor, oldSize]) => {
  // İlk yükleme sırasında watch'ı tetikleme
  if (isInitializing.value || ((!oldColor?.name && !oldSize) && (newColor?.name || newSize))) return

  console.log('Variant selection changed:', { 
    newColor: newColor?.name, 
    newSize, 
    oldColor: oldColor?.name, 
    oldSize 
  })

  if (product.value?.product?.variants) {
    const variant = product.value.product.variants.find((v) => {
      const colorMatch = !newColor?.name || v.options?.some((opt) =>
        opt.option.title.toLowerCase() === 'color' && opt.value === newColor.name
      )
      const sizeMatch = !newSize || v.options?.some((opt) =>
        opt.option.title.toLowerCase() === 'size' && opt.value === newSize
      )
      return colorMatch && sizeMatch
    })
    
    console.log('Found variant:', variant)
    
    if (variant) {
      selectedVariant.value = variant
      // Eğer mevcut quantity stoktan fazlaysa, stoktaki maksimum değere ayarla
      if (quantity.value > variant.inventory_quantity) {
        quantity.value = Math.max(1, variant.inventory_quantity)
      }
    }
  }
})

// Watch quantity changes to ensure it doesn't exceed available stock
watch(quantity, (newQuantity) => {
  if (isInitializing.value) return
  
  if (newQuantity > maxAddableQuantity.value) {
    quantity.value = maxAddableQuantity.value
  }
  if (newQuantity < 1) {
    quantity.value = 1
  }
})

// Initialize values
const initializeProduct = () => {
  if (product.value?.product) {
    isInitializing.value = true
    
    console.log('Initializing product:', product.value.product.title)
    console.log('Available variants:', product.value.product.variants)
    
    // Set first image
    if (productImages.value.length > 0) {
      currentImage.value = productImages.value[0]
    }

    // İlk stokta olan varyantı bul
    if (product.value.product.variants?.length > 0) {
      const availableVariant = product.value.product.variants.find((v) => v.inventory_quantity > 0)
      
      console.log('First available variant:', availableVariant)
      
      if (availableVariant) {
        selectedVariant.value = availableVariant
        
        // Bu varyantın renk ve beden bilgilerini al
        const colorOption = availableVariant.options?.find((opt) => 
          opt.option.title.toLowerCase() === 'color'
        )
        const sizeOption = availableVariant.options?.find((opt) => 
          opt.option.title.toLowerCase() === 'size'
        )
        
        console.log('Color option:', colorOption)
        console.log('Size option:', sizeOption)
        
        // Rengi ayarla
        if (colorOption && productColors.value.length > 0) {
          const matchingColor = productColors.value.find(color => color.name === colorOption.value)
          if (matchingColor) {
            selectedColor.value = matchingColor
            console.log('Selected color:', matchingColor)
          }
        }
        
        // Bedeni ayarla
        if (sizeOption) {
          selectedSize.value = sizeOption.value
          console.log('Selected size:', sizeOption.value)
        }
        
        // Quantity'yi stok miktarına göre ayarla
        quantity.value = Math.min(1, availableVariant.inventory_quantity)
      } else {
        // Hiçbir varyant stokta değilse ilk varyantı seç
        selectedVariant.value = product.value.product.variants[0]
        
        console.log('No available variant, using first:', selectedVariant.value)
        
        // İlk varyantın renk ve beden bilgilerini al
        const colorOption = selectedVariant.value.options?.find((opt) => 
          opt.option.title.toLowerCase() === 'color'
        )
        const sizeOption = selectedVariant.value.options?.find((opt) => 
          opt.option.title.toLowerCase() === 'size'
        )
        
        if (colorOption && productColors.value.length > 0) {
          const matchingColor = productColors.value.find(color => color.name === colorOption.value)
          if (matchingColor) {
            selectedColor.value = matchingColor
          }
        }
        
        if (sizeOption) {
          selectedSize.value = sizeOption.value
        }
        
        quantity.value = 1
      }
    }
    
    // Fallback: Eğer hiç varyant yoksa sadece renkleri ayarla
    if (!selectedColor.value.name && productColors.value.length > 0) {
      const firstAvailableColor = productColors.value.find(color => color.isAvailable)
      selectedColor.value = firstAvailableColor || productColors.value[0]
      console.log('Fallback color selection:', selectedColor.value)
    }
    
    console.log('Final selections:', {
      variant: selectedVariant.value,
      color: selectedColor.value,
      size: selectedSize.value,
      quantity: quantity.value
    })
    
    nextTick(() => {
      isInitializing.value = false
    })
  }
}




// Load product data
const loadProduct = async () => {
  try {
    isLoading.value = true
    error.value = ''
    await productStore.getProductByHandle(handle)
    initializeProduct()
  } catch (err) {
    console.error('Failed to load product:', err)
    error.value = 'Ürün yüklenirken bir hata oluştu.'
  } finally {
    isLoading.value = false
  }
}

// Methods
const increaseQuantity = () => {
  if (quantity.value < maxAddableQuantity.value) {
    quantity.value++
  }
}

const addToCart = async () => {
  try {
    if (!selectedVariant.value) {
      alert('Lütfen ürün seçeneklerini belirleyin.')
      return
    }

    if (selectedVariant.value.inventory_quantity === 0) {
      alert('Bu ürün stokta bulunmamaktadır.')
      return
    }

    if (quantity.value > selectedVariant.value.inventory_quantity) {
      alert(`Maksimum ${selectedVariant.value.inventory_quantity} adet sipariş verebilirsiniz.`)
      return
    }

    // Get current cart to check existing quantity
    await cartStore.getCart()
    let currentQuantityInCart = 0

    if (cartStore.cart?.cart?.items) {
      const existingItem = cartStore.cart.cart.items.find(
        item => item.variant_id === selectedVariant.value?.id
      )
      currentQuantityInCart = existingItem ? existingItem.quantity : 0
    }

    // Check if adding new quantity would exceed inventory
    const totalQuantity = currentQuantityInCart + quantity.value

    if (totalQuantity > selectedVariant.value.inventory_quantity) {
      const remainingStock = selectedVariant.value.inventory_quantity - currentQuantityInCart

      if (remainingStock <= 0) {
        alert('Bu üründen sepetinizde zaten maksimum stok miktarı bulunmaktadır.')
        return
      } else {
        alert(`Bu üründen sepetinizde ${currentQuantityInCart} adet var. En fazla ${remainingStock} adet daha ekleyebilirsiniz.`)
        return
      }
    }

    // Add to cart using cart store
    await cartStore.addToCart(selectedVariant.value.id, quantity.value)
    alert(`${quantity.value} adet ${product.value?.product?.title} sepete eklendi!`)
  } catch (err) {
    console.error('Failed to add to cart:', err)

    // Handle specific inventory error from API
    if (err.message && err.message.includes('insufficient_inventory')) {
      alert('Stokta yeterli ürün bulunmamaktadır. Sepetinizdeki mevcut miktarla birlikte stok limiti aşılıyor.')
    } else {
      alert('Sepete eklenirken bir hata oluştu.')
    }
  }
}

const toggleFavorite = () => {
  // Here you would implement actual favorites logic
  isFavorite.value = !isFavorite.value
  const action = isFavorite.value ? 'eklendi' : 'çıkarıldı'
  alert(`Ürün favorilerinize ${action}!`)
}

// Load product on component mount
onMounted(async () => {
  await loadProduct()
  // Load cart to check existing quantities
  await cartStore.getCart()
})

// SEO
useHead(() => ({
  title: product.value?.product ? `${product.value.product.title} - Your Store` : 'Product Detail - Your Store',
  meta: [
    {
      name: 'description',
      content: product.value?.product?.description || 'Product detail page'
    }
  ]
}))
</script>

<style scoped>
.aspect-square {
  aspect-ratio: 1/1;
}
</style>