<template>
    <div class="w-full flex flex-col md:flex-row relative z-10 min-h-[90vh] md:min-h-[100vh] bg-sacrel-accent/15">
        <!-- Mobile: Single image, Desktop: Side by side images -->
        <Transition name="fade" mode="out-in">
            <div 
                :key="`mobile-${mobileIndex}`"
                class="w-full h-[90vh] bg-cover bg-center transition-all duration-1000 z-0 md:hidden"
                :style="{ backgroundImage: `url(${currentMobileImage})` }">
            </div>
        </Transition>
        
        <!-- Desktop: Two images side by side -->
        <Transition name="fade" mode="out-in">
            <div 
                :key="`left-${currentIndex}`"
                class="hidden md:block md:w-1/2 h-[100vh] bg-cover bg-center transition-all duration-1000 z-0"
                :style="{ backgroundImage: `url(${currentImages[0]})` }">
            </div>
        </Transition>
        <Transition name="fade" mode="out-in">
            <div 
                :key="`right-${currentIndex}`"
                class="hidden md:block md:w-1/2 h-[100vh] bg-cover bg-center transition-all duration-1000 z-0"
                :style="{ backgroundImage: `url(${currentImages[1]})`}">
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

// Safely fetch carousel medias with error handling
let items: any[] = [];
try {
    const result = await getUiCarouselMedias();
    items = result?.items || result || [];
    console.log("Carousel medias:", items);
} catch (error) {
    console.error("Failed to fetch carousel medias:", error);
    items = []; // Fallback to empty array
}

// Reactive current image index
const currentIndex = ref(0);
// Separate mobile index for single image rotation
const mobileIndex = ref(0);

// All individual images for mobile carousel
const allImages = computed(() => {
    const validItems = Array.isArray(items) ? items : [];
    if (validItems.length > 0) {
        return validItems.map(item => item.image_url);
    } else {
        return ['/images/girl.webp', '/images/girl2.webp', '/images/girl3.jpg', '/images/girl4.jpg'];
    }
});

// Current mobile image
const currentMobileImage = computed(() => {
    return allImages.value[mobileIndex.value % allImages.value.length] || '/images/girl.webp';
});

// Create pairs of images
const imagePairs = computed(() => {
    // Ensure items is an array and handle undefined/null cases
    const validItems = Array.isArray(items) ? items : [];
    
    if (validItems.length >= 2) {
        const pairs = [];
        for (let i = 0; i < validItems.length; i += 2) {
            if (i + 1 < validItems.length) {
                pairs.push([validItems[i].image_url, validItems[i + 1].image_url]);
            } else {
                // If odd number of images, pair the last one with the first
                pairs.push([validItems[i].image_url, validItems[0].image_url]);
            }
        }
        return pairs;
    } else if (validItems.length === 1) {
        return [[validItems[0].image_url, validItems[0].image_url]];
    } else {
        return [['/images/girl.webp', '/images/girl2.webp']];
    }
});

// Current images based on index
const currentImages = computed(() => {
    return imagePairs.value[currentIndex.value] || ['/images/girl.webp', '/images/girl2.webp'];
});

// Auto-cycle through image pairs (desktop) and single images (mobile)
let intervalId: NodeJS.Timeout | null = null;
let mobileIntervalId: NodeJS.Timeout | null = null;

onMounted(() => {
    // Desktop carousel - pairs of images
    if (imagePairs.value.length > 1) {
        intervalId = setInterval(() => {
            currentIndex.value = (currentIndex.value + 1) % imagePairs.value.length;
        }, 5000); // Change every 5 seconds
    }
    
    // Mobile carousel - individual images
    if (allImages.value.length > 1) {
        mobileIntervalId = setInterval(() => {
            mobileIndex.value = (mobileIndex.value + 1) % allImages.value.length;
        }, 5000); // Change every 5 seconds
    }
});

onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId);
    }
    if (mobileIntervalId) {
        clearInterval(mobileIntervalId);
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