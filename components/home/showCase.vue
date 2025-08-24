<template>
    <div class="py-16 md:py-24">
        <!-- SACREL Showcase Section -->
        <div
            class="showcase-section flex justify-center items-center py-20 md:py-32 bg-sacrel-accent mx-auto rounded-lg">
            <div class="text-center text-sacrel-primary px-6">
                <h2 class="sacrel-heading-xl font-secondary">SACREL</h2>
                <p class="sacrel-heading-md mt-6">Modern Kadın Butik Moda</p>
                <p class="sacrel-body-lg mt-4 mb-8">Kendinizi özel hissedin</p>
                <NuxtLink to="/products">
                    <button
                        class="sacrel-btn-primary bg-sacrel-primary text-white hover:bg-sacrel-neutral px-8 py-3 rounded-md transition duration-300 font-accent uppercase tracking-wider">
                        Koleksiyonu Keşfet
                    </button>
                </NuxtLink>
            </div>
        </div>

        <!-- Featured Products Section -->
        <div class="mt-16 md:mt-24">
            <div class="text-center mb-12">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Öne Çıkan Ürünler
                </h2>
                <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                    Bu sezonun en trend parçalarını keşfedin
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div v-for="product in featuredProducts" :key="product.id"
                    class="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div class="aspect-w-3 aspect-h-4">
                        <img :src="product.image" :alt="product.title"
                            class="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 class="text-xl font-semibold mb-2">{{ product.title }}</h3>
                        <p class="text-gray-200 mb-3">{{ product.description }}</p>
                        <div class="flex justify-between items-center">
                            <span class="text-2xl font-bold">{{ formatPrice(product.price) }}</span>
                            <NuxtLink :to="`/products/${product.id}`"
                                class="bg-white text-gray-900 px-4 py-2 rounded font-medium hover:bg-gray-100 transition duration-300">
                                İncele
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>

            <div class="text-center mt-12">
                <NuxtLink to="/products"
                    class="inline-block bg-gray-900 text-white px-8 py-3 font-semibold hover:bg-gray-800 transition duration-300">
                    Tüm Ürünleri Gör
                </NuxtLink>
            </div>
        </div>

        <!-- Image Banner Section -->
        <div class="image-banner-section mt-16 md:mt-24 flex flex-col items-center relative rounded-lg overflow-hidden">
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="SACREL Collection" class="w-full h-96 md:h-[500px] object-cover" />
            <div
                class="absolute inset-0 flex flex-col justify-center items-center text-white px-6 bg-black bg-opacity-30">
                <h3 class="sacrel-heading-lg font-secondary mb-6 text-center">Yeni Koleksiyon</h3>
                <p class="sacrel-body-lg mb-8 text-center max-w-2xl">
                    Sadeliği zarafette buluşturan, modern kadının günlük yaşamına değer katan özel tasarımlar.
                </p>
                <NuxtLink to="/products">
                    <button
                        class="bg-white text-black px-8 py-3 rounded-md hover:bg-gray-100 transition duration-300 font-accent uppercase tracking-wider">
                        Alışverişe Başla
                    </button>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const featuredProducts = [
    {
        id: 1,
        title: "Zarif Abiye",
        description: "Özel günler için",
        price: 899.99,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop"
    },
    {
        id: 2,
        title: "Günlük Bluz",
        description: "Rahat ve şık",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=600&fit=crop"
    },
    {
        id: 3,
        title: "Klasik Pantolon",
        description: "Zamansız stil",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop"
    }
]

const formatPrice = (price: any) => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
    }).format(price)
}
</script>
