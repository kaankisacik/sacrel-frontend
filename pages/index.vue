<template>
    <div class="bg-sacrel-light min-h-screen">
        <Banner />
        <!-- <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8"> -->
            <!-- <ShowCase /> -->
            
            <!-- Featured Products Section -->
            <!-- <section class="mt-16 md:mt-20 lg:mt-32">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-bold text-gray-900 mb-4">Öne Çıkan Ürünler</h2>
                    <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                        En popüler ve yeni ürünlerimizi keşfedin
                    </p>
                </div>
                
                <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <div v-for="n in 8" :key="n" class="animate-pulse">
                        <div class="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                        <div class="h-4 bg-gray-200 rounded mb-2"></div>
                        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                </div>
                
                <div v-else-if="error" class="text-center py-12">
                    <p class="text-red-600">Ürünler yüklenirken bir hata oluştu: {{ error }}</p>
                </div>
                
                <div v-else-if="featuredProducts && featuredProducts.length > 0" 
                     class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <ProductCard
                        v-for="product in featuredProducts"
                        :key="product.id"
                        :product="transformProduct(product)"
                        @click="navigateToProduct(product.id)"
                    />
                </div>
                
                <div v-else class="text-center py-12">
                    <p class="text-gray-600">Henüz ürün bulunmamaktadır.</p>
                </div>
                
                <div class="text-center mt-12">
                    <NuxtLink 
                        to="/products" 
                        class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition duration-300"
                    >
                        Tüm Ürünleri Görüntüle
                    </NuxtLink>
                </div>
            </section> -->
            
            <!-- <div class="mt-16 md:mt-20 lg:mt-32">
                <Freebook />
            </div> -->
        <!-- </div> -->
    </div>
</template>

<script setup>
// SEO
useHead({
    title: 'Sacrel - Modern Moda Koleksiyonu',
    meta: [
        { name: 'description', content: 'Modern ve şık koleksiyonlarımızı keşfedin. Kaliteli kumaşlar ve özel tasarımlarla hazırlanmış ürünlerimizi inceleyin.' }
    ]
})

// Medusa client'ı kullanarak ürünleri getir
const client = useMedusaClient()
const { data: productsData, pending, error } = await useLazyAsyncData('featured-products', async () => {
    try {
        const { products } = await client.store.product.list({ limit: 8 })
        console.log("Fetched products from home:", products);

        return products
    } catch (err) {
        console.error('Error fetching products:', err)
        throw err
    }
})

const featuredProducts = computed(() => productsData.value || [])

// Ürün dönüştürme fonksiyonu (mevcut ProductCard component'i ile uyumlu hale getirmek için)
const transformProduct = (product) => {
    const firstVariant = product.variants?.[0]
    const price = firstVariant?.prices?.[0]?.amount || 0
    
    return {
        id: product.id,
        title: product.title,
        subtitle: product.subtitle,
        image: product.thumbnail || '/images/placeholder.jpg',
        hoverImage: product.images?.[1]?.url || null,
        price: price / 100, // Medusa fiyatları cent cinsinden tutar
        originalPrice: null,
        discount: 0,
        isFavorite: false, // Bu bilgi ayrı bir sistem ile yönetilebilir
        brand: product.collection?.title || 'Sacrel',
        variantId: firstVariant?.id
    }
}

// Ürün detay sayfasına yönlendirme
const navigateToProduct = (productId) => {
    navigateTo(`/products/${productId}`)
}

// Cart store'u initialize et
const cartStore = useCartStore()
onMounted(() => {
    cartStore.initCart()
})
</script>