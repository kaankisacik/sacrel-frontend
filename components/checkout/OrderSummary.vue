<template>
  <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Sipariş Özeti</h2>

    <!-- Loading State -->
    <div v-if="isLoading" class="animate-pulse">
      <div class="space-y-3 mb-6">
        <div v-for="i in 3" :key="i" class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-gray-200 rounded-lg"></div>
          <div class="flex-1">
            <div class="h-4 bg-gray-200 rounded mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div class="w-16 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div class="space-y-2 mb-6 border-t pt-4">
        <div v-for="i in 4" :key="i" class="flex justify-between">
          <div class="w-20 h-4 bg-gray-200 rounded"></div>
          <div class="w-16 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Order Items -->
    <div v-else-if="summary.items.length > 0" class="space-y-3 mb-6">
      <div
        v-for="item in summary.items"
        :key="item.id"
        class="flex items-center space-x-3"
      >
        <div class="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
          <img
            :src="item.thumbnail || '/images/placeholder.svg'"
            :alt="item.title"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">{{ item.title }}</p>
          <p v-if="item.variantTitle" class="text-xs text-gray-600">
            {{ item.variantTitle }}
          </p>
          <p class="text-sm text-gray-600">{{ item.quantity }} adet</p>
        </div>
        <div class="text-sm font-medium text-gray-900">
          {{ checkoutHelper.formatPrice(item.total) }}
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <div class="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 9H6L5 9z" />
        </svg>
      </div>
      <p class="text-gray-600">Sepetinizde ürün bulunmuyor</p>
    </div>

    <!-- Price Breakdown -->
    <div v-if="summary.items.length > 0" class="space-y-2 mb-6 border-t pt-4">
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Ara Toplam ({{ summary.itemCount }} ürün):</span>
        <span class="text-gray-900">{{ checkoutHelper.formatPrice(summary.pricing.subtotal) }}</span>
      </div>
      
      <div v-if="summary.pricing.discount > 0" class="flex justify-between text-sm">
        <span class="text-gray-600">İndirim:</span>
        <span class="text-green-600">-{{ checkoutHelper.formatPrice(summary.pricing.discount) }}</span>
      </div>
      
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">KDV:</span>
        <span class="text-gray-900">{{ checkoutHelper.formatPrice(summary.pricing.tax) }}</span>
      </div>
      
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Kargo:</span>
        <span class="text-gray-900">
          {{ summary.pricing.shipping > 0 ? checkoutHelper.formatPrice(summary.pricing.shipping) : '-' }}
        </span>
      </div>
      
      <div v-if="showCodFee" class="flex justify-between text-sm">
        <span class="text-gray-600">Kapıda Ödeme Ücreti:</span>
        <span class="text-gray-900">{{ checkoutHelper.formatPrice(codFee) }}</span>
      </div>
      
      <div class="border-t pt-2">
        <div class="flex justify-between text-lg font-semibold">
          <span class="text-gray-900">Toplam:</span>
          <span class="text-gray-900">{{ checkoutHelper.formatPrice(finalTotal) }}</span>
        </div>
      </div>
    </div>

    <!-- Order Actions -->
    <div v-if="showActions && summary.items.length > 0" class="space-y-3">
      <!-- Complete Order Button -->
      <button
        v-if="showCompleteButton"
        @click="$emit('complete')"
        :disabled="!canComplete || isProcessing"
        class="w-full bg-black text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isProcessing" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ processingText }}
        </span>
        <span v-else>{{ completeButtonText }}</span>
      </button>

      <!-- Continue Shopping -->
      <NuxtLink
        v-if="showContinueButton"
        to="/products"
        class="block w-full text-center border border-gray-300 text-gray-900 py-3 px-4 rounded-md font-medium hover:bg-gray-50 transition duration-300"
      >
        Alışverişe Devam Et
      </NuxtLink>
    </div>

    <!-- Security Notice -->
    <div v-if="showSecurityNotice" class="mt-4 p-3 bg-gray-50 rounded-lg">
      <div class="flex items-center space-x-2">
        <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
        </svg>
        <span class="text-xs text-gray-600">Güvenli ödeme ile korunuyorsunuz</span>
      </div>
    </div>

    <!-- Order Reference -->
    <div v-if="orderReference" class="mt-4 p-3 bg-blue-50 rounded-lg">
      <div class="text-xs text-blue-800">
        <span class="font-medium">Sipariş Referansı:</span>
        <span class="ml-1 font-mono">{{ orderReference }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { checkoutHelper, type CheckoutSummary } from '~/utils/checkoutHelpers';

interface Props {
  summary: CheckoutSummary;
  codFee?: number;
  showCodFee?: boolean;
  showActions?: boolean;
  showCompleteButton?: boolean;
  showContinueButton?: boolean;
  showSecurityNotice?: boolean;
  canComplete?: boolean;
  isLoading?: boolean;
  isProcessing?: boolean;
  completeButtonText?: string;
  processingText?: string;
  orderReference?: string;
}

interface Emits {
  (e: 'complete'): void;
}

const props = withDefaults(defineProps<Props>(), {
  codFee: 0,
  showCodFee: false,
  showActions: true,
  showCompleteButton: true,
  showContinueButton: true,
  showSecurityNotice: true,
  canComplete: true,
  isLoading: false,
  isProcessing: false,
  completeButtonText: 'Siparişi Tamamla',
  processingText: 'Sipariş Veriliyor...',
  orderReference: '',
});

const emit = defineEmits<Emits>();
onMounted(() => {
  console.log(props.summary);
  
});
// Computed
const finalTotal = computed(() => {
  let total = props.summary.pricing.total;
  if (props.showCodFee) {
    total += props.codFee;
  }
  return total;
});

// Methods
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  // Use the SVG placeholder instead of a missing file
  target.src = '/images/placeholder.svg';
};
</script>
