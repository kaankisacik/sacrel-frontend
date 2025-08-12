<template>
  <div class="min-h-screen bg-white">
    <!-- Breadcrumb -->
    <div class="container mx-auto px-4 py-4">
      <nav class="text-sm text-gray-600">
        <NuxtLink to="/" class="hover:text-black">Anasayfa</NuxtLink>
        <span class="mx-2">/</span>
        <NuxtLink to="/products" class="hover:text-black">Giyim</NuxtLink>
        <span class="mx-2">/</span>
        <span class="text-black">{{ product?.title || 'Ürün Detayı' }}</span>
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
              :alt="product?.title"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
          </div>
          
          <!-- Thumbnail Images -->
          <div class="flex space-x-3 overflow-x-auto">
            <button
              v-for="(image, index) in product?.images"
              :key="index"
              @click="currentImage = image"
              class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all"
              :class="currentImage === image ? 'border-black' : 'border-gray-200 hover:border-gray-400'"
            >
              <img
                :src="image"
                :alt="`${product?.title} ${index + 1}`"
                class="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        <!-- Product Info -->
        <div class="space-y-6">
          <!-- Product Title and Brand -->
          <div>
            <h1 class="text-3xl font-bold text-black mb-2">{{ product?.title }}</h1>
            <p class="text-gray-600 uppercase text-sm tracking-wide">{{ product?.brand }}</p>
          </div>

          <!-- Price -->
          <div class="flex items-center space-x-3">
            <span class="text-3xl font-bold text-black">{{ product?.price }} TL</span>
            <span v-if="product?.originalPrice" class="text-lg text-gray-400 line-through">
              {{ product?.originalPrice }} TL
            </span>
            <span v-if="product?.discount" class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              {{ product?.discount }}% İNDİRİM
            </span>
          </div>

          <!-- Color Selection -->
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <span class="font-medium">RENK SEÇİMİ:</span>
              <span class="text-sm text-gray-600">({{ selectedColor.name }})</span>
            </div>
            <div class="flex space-x-3">
              <button
                v-for="color in product?.colors"
                :key="color.id"
                @click="selectedColor = color"
                class="w-8 h-8 rounded-full border-2 transition-all"
                :class="selectedColor.id === color.id ? 'border-black' : 'border-gray-300'"
                :style="{ backgroundColor: color.hex }"
                :title="color.name"
              ></button>
            </div>
          </div>

          <!-- Size Selection -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-medium">BEDEN SEÇİMİ:</span>
              <button class="text-sm text-gray-600 underline hover:text-black">
                Beden Tablosu
              </button>
            </div>
            <div class="grid grid-cols-6 gap-2">
              <button
                v-for="size in product?.sizes"
                :key="size"
                @click="selectedSize = size"
                :disabled="!product?.availableSizes?.includes(size)"
                class="py-2 px-3 border rounded transition-all text-sm"
                :class="[
                  selectedSize === size 
                    ? 'border-black bg-black text-white' 
                    : 'border-gray-300 hover:border-black',
                  !product?.availableSizes?.includes(size) 
                    ? 'opacity-50 cursor-not-allowed line-through' 
                    : 'cursor-pointer'
                ]"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Product Description -->
          <div class="space-y-2">
            <p class="text-gray-600 text-sm leading-relaxed">
              {{ product?.description }}
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
                :disabled="!selectedSize || !selectedColor"
                class="w-full bg-black text-white py-4 font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                SEPETE EKLE
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
      <div class="mt-16">
        <h2 class="text-2xl font-bold mb-8">Benzer Ürünler</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="similarProduct in similarProducts" :key="similarProduct.id" class="group cursor-pointer">
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
              <span class="font-bold">{{ similarProduct.price }} TL</span>
              <span v-if="similarProduct.originalPrice" class="text-xs text-gray-400 line-through">
                {{ similarProduct.originalPrice }} TL
              </span>
            </div>
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

// Reactive data
const currentImage = ref<string>('')
const selectedColor = ref<Color>({ id: '', name: '', hex: '' })
const selectedSize = ref<string>('')
const quantity = ref<number>(1)
const isFavorite = ref<boolean>(false)
const isLoading = ref<boolean>(true)

// Mock product data - In real app, this would come from an API
const product = ref<Product>({
  id: route.params.id as string,
  title: 'Elegant Summer Dress',
  brand: 'ZARA',
  price: 449,
  originalPrice: 599,
  discount: 25,
  description: 'A beautiful summer dress made from lightweight, breathable fabric perfect for any occasion. Made from high-quality materials.',
  images: [
    '/images/girl.webp',
    '/images/girl1.jpg',
    '/images/girl2.webp',
    '/images/girl3.jpg'
  ],
  colors: [
    { id: '1', name: 'Sarı', hex: '#FFD700' },
    { id: '2', name: 'Mavi', hex: '#4169E1' }
  ],
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  availableSizes: ['XS', 'S', 'M', 'L', 'XL']
})

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

const similarProducts = ref<SimilarProduct[]>([
  {
    id: '1',
    title: 'Men Printed Pure Cotton Casual Shirt',
    description: 'Rahat ve modern kesim gömleklerin vazgeçilmez stili...',
    image: '/images/guy2.jpg',
    price: 459,
    originalPrice: 599
  },
  {
    id: '2',
    title: 'Men Embroidered Short Sleeve T-Shirt',
    description: 'Rahat ve modern kesim tişörtlerin vazgeçilmez stili...',
    image: '/images/guy3.webp',
    price: 799,
    originalPrice: 999
  },
  {
    id: '3',
    title: 'Men Printed Cotton Blend Regular Fit Casual Shirt',
    description: 'Rahat ve modern kesim gömleklerin vazgeçilmez stili...',
    image: '/images/lady.jpg',
    price: 399,
    originalPrice: 499
  },
  {
    id: '4',
    title: 'Men Solid Pure Cotton Regular Fit Casual Shirt',
    description: 'Rahat ve modern kesim gömleklerin vazgeçilmez stili...',
    image: '/images/lady2.jpg',
    price: 479,
    originalPrice: 599
  }
])

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

const addToCart = () => {
  if (!selectedSize.value || !selectedColor.value.id) {
    alert('Lütfen beden ve renk seçiniz.')
    return
  }
  
  // Here you would typically call an API to add the item to cart
  console.log('Adding to cart:', {
    productId: product.value.id,
    size: selectedSize.value,
    color: selectedColor.value,
    quantity: quantity.value
  })
  
  alert('Ürün sepete eklendi!')
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  // Here you would typically call an API to toggle favorite status
  console.log('Toggle favorite:', product.value.id, isFavorite.value)
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR')
}

// Lifecycle
onMounted(() => {
  // Set initial values
  if (product.value.images && product.value.images.length > 0) {
    currentImage.value = product.value.images[0]!
  }
  
  if (product.value.colors && product.value.colors.length > 0) {
    selectedColor.value = product.value.colors[0]!
  }
  
  isLoading.value = false
})

// SEO
useHead({
  title: `${product.value.title} - SACREL`,
  meta: [
    {
      name: 'description',
      content: product.value.description
    },
    {
      property: 'og:title',
      content: `${product.value.title} - SACREL`
    },
    {
      property: 'og:description',
      content: product.value.description
    },
    {
      property: 'og:image',
      content: currentImage.value
    }
  ]
})
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
