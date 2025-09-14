<template>
    <div class="flex items-center justify-between">
        <!-- Navigation Arrows -->
        <button @click="prevSlide"
            class=" top-1/2 -translate-y-1/2       transition-all duration-200 z-20 -rotate-90 text-6xl"
            aria-label="Önceki ürünler">
            ▲
        </button>
        <!-- Slider Container -->
         <template v-if="displayProducts.length === 0">
            <div class="text-center text-gray-500 col-span-3 py-10">
                Ürün bulunamadı.
            </div>
        </template>
        <ProductCard v-for="(product, index) in displayProducts" :key="index" :product="product" />



        <button @click="nextSlide"
            class=" top-1/2 -translate-y-1/2       transition-all duration-200 z-20 -rotate-90 text-6xl"
            aria-label="Sonraki ürünler">
            ▼
        </button>

        <!-- Dots Indicator -->
        <div v-if="showDots && totalSlides > 1" class="flex justify-center mt-6 space-x-2">
            <button v-for="dot in totalSlides" :key="dot" @click="goToSlide(dot - 1)"
                class="w-2 h-2 rounded-full transition-all duration-200"
                :class="currentSlide === dot - 1 ? 'bg-black' : 'bg-gray-300 hover:bg-gray-400'"
                :aria-label="`${dot}. slayda git`"></button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { StoreProduct } from '@medusajs/types';

interface Props {
    products: StoreProduct[];
    slidesToShow?: number;
    showDots?: boolean;
    autoplay?: boolean;
    autoplayDelay?: number;
}

const props = withDefaults(defineProps<Props>(), {
    slidesToShow: 3,
    showDots: true,
    autoplay: false,
    autoplayDelay: 3000
});

// Reactive state
const currentSlide = ref(0);
const sliderContainer = ref<HTMLElement>();
const containerWidth = ref(0);
const currentSlidesToShow = ref(3);
const displayProducts = ref<StoreProduct[]>([]);

// Computed properties
const slideWidth = computed(() => {
    if (containerWidth.value === 0) return 0;
    // Account for gaps between items: (slidesToShow - 1) * 24px gap
    const totalGapWidth = (currentSlidesToShow.value - 1) * 24; // gap-6 = 24px
    const availableWidth = containerWidth.value - totalGapWidth;
    return Math.max(0, availableWidth / currentSlidesToShow.value);
});

const totalSlides = computed(() => {
    return Math.max(0, displayProducts.value.length - currentSlidesToShow.value + 1);
});

const canGoPrev = computed(() => {
    return props.products.length > 0; // Always true if there are products
});

const canGoNext = computed(() => {
    return props.products.length > 0; // Always true if there are products
});

// Methods
const nextSlide = () => {
    if (props.products.length > 0) {
        // Check if we're at the end of visible slides
        if (currentSlide.value >= totalSlides.value - 1) {
            // Move first item to the end
            const firstItem = displayProducts.value.shift();
            if (firstItem) {
                displayProducts.value.push(firstItem);
            }
            // Reset slide position
            currentSlide.value = 0;
        } else {
            currentSlide.value++;
        }
    }
};

const prevSlide = () => {
    if (props.products.length > 0) {
        if (currentSlide.value <= 0) {
            // Move last item to the beginning
            const lastItem = displayProducts.value.pop();
            if (lastItem) {
                displayProducts.value.unshift(lastItem);
            }
            // Set slide position to show the moved item
            currentSlide.value = 0;
        } else {
            currentSlide.value--;
        }
    }
};

const goToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides.value) {
        currentSlide.value = index;
    }
};

const updateContainerWidth = () => {
    if (sliderContainer.value?.parentElement) {
        // Subtract margin from container width (80px = 20px * 2 for mx-20)
        containerWidth.value = sliderContainer.value.parentElement.clientWidth - 80;
    }
};

// Autoplay functionality
let autoplayInterval: NodeJS.Timeout;

const startAutoplay = () => {
    if (props.autoplay) {
        autoplayInterval = setInterval(() => {
            nextSlide(); // Always go to next slide in infinite loop
        }, props.autoplayDelay);
    }
};

const stopAutoplay = () => {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
    }
};

// Responsive breakpoints
const updateSlidesToShow = () => {
    if (typeof window !== 'undefined') {
        const width = window.innerWidth;

        if (width < 640) { // sm
            currentSlidesToShow.value = 1;
        } else if (width < 768) { // md
            currentSlidesToShow.value = 2;
        } else { // lg and above
            currentSlidesToShow.value = Math.min(3, props.slidesToShow); // Max 3 products
        }

        // Update container width based on new slides to show
        updateContainerWidth();
    }
};

// Lifecycle
onMounted(() => {
    // Initialize display products
    displayProducts.value = [...props.products];

    updateContainerWidth();
    updateSlidesToShow();
    startAutoplay();

    window.addEventListener('resize', () => {
        updateContainerWidth();
        updateSlidesToShow();
    });
});

// Watch for changes in products prop
watch(() => props.products, (newProducts) => {
    displayProducts.value = [...newProducts];
    currentSlide.value = 0;
}, { immediate: true });

onUnmounted(() => {
    stopAutoplay();
    window.removeEventListener('resize', updateContainerWidth);
});

// Watch for autoplay changes
watch(() => props.autoplay, (newVal) => {
    if (newVal) {
        startAutoplay();
    } else {
        stopAutoplay();
    }
});

// Pause autoplay on hover
const handleMouseEnter = () => {
    stopAutoplay();
};

const handleMouseLeave = () => {
    startAutoplay();
};
</script>

<style scoped>
/* Additional styles for better touch support on mobile */
@media (max-width: 640px) {
    .overflow-hidden {
        touch-action: pan-x;
    }
}

/* Force ProductCard to take full width and show borders properly */
.slider-card-container :deep(.border-4) {
    border: 4px solid black !important;
    border-width: 4px !important;
    border-style: solid !important;
    border-color: black !important;
}

.slider-card-container :deep(a) {
    max-width: none !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    width: 100% !important;
    display: block !important;
}
</style>
