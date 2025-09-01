<template>
    <div class="w-full flex flex-col md:flex-row relative z-10 min-h-screen">
        <Transition name="fade" mode="out-in">
            <div 
                :key="`left-${currentIndex}`"
                class="w-full md:w-1/2 bg-cover bg-center transition-all duration-1000 z-0 min-h-[50vh] md:min-h-screen"
                :style="{ backgroundImage: `url(${currentImages[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' }">
            </div>
        </Transition>
        <Transition name="fade" mode="out-in">
            <div 
                :key="`right-${currentIndex}`"
                class="w-full md:w-1/2 bg-cover bg-center transition-all duration-1000 z-0 min-h-[50vh] md:min-h-screen"
                :style="{ backgroundImage: `url(${currentImages[1]})`, backgroundSize: 'cover', backgroundPosition: 'center' }">
            </div>
        </Transition>

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
const {getUiCarouselMedias} = useUiMedia();

const {items} = await getUiCarouselMedias();
console.log("Carousel medias:", items);

// Reactive current image index
const currentIndex = ref(0);

// Create pairs of images
const imagePairs = computed(() => {
    if (items.length >= 2) {
        const pairs = [];
        for (let i = 0; i < items.length; i += 2) {
            if (i + 1 < items.length) {
                pairs.push([items[i].image_url, items[i + 1].image_url]);
            } else {
                // If odd number of images, pair the last one with the first
                pairs.push([items[i].image_url, items[0].image_url]);
            }
        }
        return pairs;
    } else if (items.length === 1) {
        return [[items[0].image_url, items[0].image_url]];
    } else {
        return [['/images/girl11.jpg', '/images/girl22.webp']];
    }
});

// Current images based on index
const currentImages = computed(() => {
    return imagePairs.value[currentIndex.value] || ['/images/girl11.jpg', '/images/girl22.webp'];
});

// Auto-cycle through image pairs
let intervalId: NodeJS.Timeout | null = null;

onMounted(() => {
    if (imagePairs.value.length > 1) {
        intervalId = setInterval(() => {
            currentIndex.value = (currentIndex.value + 1) % imagePairs.value.length;
        }, 5000); // Change every 5 seconds
    }
});

onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId);
    }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 1s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}
</style>