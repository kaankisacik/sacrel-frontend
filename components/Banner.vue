<template>
    <div class="w-full flex flex-col md:flex-row relative z-10 min-h-screen">
        <div class="w-full md:w-1/2 bg-cover bg-center transition-all duration-500 z-0 min-h-[50vh] md:min-h-screen"
            :style="{ backgroundImage: `url(${currentImages[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' }">
        </div>
        <div class="w-full md:w-1/2 bg-cover bg-center transition-all duration-500 z-0 min-h-[50vh] md:min-h-screen"
            :style="{ backgroundImage: `url(${currentImages[1]})`, backgroundSize: 'cover', backgroundPosition: 'center' }">
        </div>

        <div class="absolute top-8 md:top-12 left-8 md:left-20 m-2 md:m-8 z-10">
            <h1
                class="text-sacrel-light font-secondary text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem] leading-none tracking-tight drop-shadow-2xl sacrel-fade-in">
                SACREL
            </h1>
            <div class="mt-6 md:mt-8 max-w-sm">
                <p
                    class="text-sacrel-light font-accent text-lg md:text-xl leading-relaxed tracking-wide drop-shadow-lg sacrel-slide-up">
                    Zamansız zarafet ve modern sofistikasyon ile stili yükseltiyoruz
                </p>
                <NuxtLink  to="/products">
                <button class="mt-6 md:mt-8 sacrel-btn-accent sacrel-scale-in">
                    Koleksiyonu Keşfet
                </button>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const currentImages = ref([
    '/images/girl1.jpg',
    '/images/girl2.webp'
]);
</script>