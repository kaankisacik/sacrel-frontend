<template>
  <div class="min-h-screen  py-12">
    <div class="container mx-auto px-4">
      <!-- Success Header -->
      <div class="text-center mb-12">
        <div class="w-24 h-24 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Siparişiniz Alındı!</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Teşekkür ederiz! Siparişiniz başarıyla oluşturuldu ve en kısa sürede size ulaştırılacak.
        </p>
      </div>

      <!-- Order Details -->
      <div v-if="!isLoading && order" class="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Sipariş Detayları</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Sipariş Numarası</h3>
              <p class="text-lg font-semibold text-gray-900">#{{ order.display_id || order.id }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Sipariş Tarihi</h3>
              <p class="text-lg text-gray-900">{{ formatDate(order.created_at) }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Toplam Tutar</h3>
              <p class="text-lg font-semibold text-gray-900">{{ formatPrice(order.total) }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Durum</h3>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {{ checkoutHelper.getOrderStatus(order.fulfillment_status) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Sipariş Edilen Ürünler</h3>
          <div class="space-y-4">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex items-center space-x-4"
            >
              <div class="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  :src="getItemImage(item)"
                  :alt="getItemTitle(item)"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1">
                <h4 class="text-sm font-medium text-gray-900">{{ getItemTitle(item) }}</h4>
                <p class="text-sm text-gray-600">{{ getItemVariant(item) }}</p>
                <p class="text-sm text-gray-600">Adet: {{ item.quantity }}</p>
              </div>
              <div class="text-sm font-medium text-gray-900">
                {{ formatPrice(item.total) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Shipping & Billing -->
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div v-if="order.shipping_address">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Teslimat Adresi</h3>
              <div class="text-sm text-gray-600 space-y-1">
                <p class="font-medium">{{ order.shipping_address.first_name }} {{ order.shipping_address.last_name }}</p>
                <p>{{ order.shipping_address.address_1 }}</p>
                <p>{{ order.shipping_address.city }}, {{ order.shipping_address.postal_code }}</p>
                <p v-if="order.shipping_address.phone">{{ order.shipping_address.phone }}</p>
              </div>
            </div>
            <div v-if="order.billing_address">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Fatura Adresi</h3>
              <div class="text-sm text-gray-600 space-y-1">
                <p class="font-medium">{{ order.billing_address.first_name }} {{ order.billing_address.last_name }}</p>
                <p>{{ order.billing_address.address_1 }}</p>
                <p>{{ order.billing_address.city }}, {{ order.billing_address.postal_code }}</p>
                <p v-if="order.billing_address.phone">{{ order.billing_address.phone }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="isLoading" class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div class="animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div class="space-y-3">
            <div class="h-4 bg-gray-200 rounded"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6"></div>
            <div class="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Sipariş Bulunamadı</h3>
        <p class="text-gray-600 mb-4">İstediğiniz sipariş bulunamadı veya erişim izniniz yok.</p>
      </div>

      <!-- Action Buttons -->
      <div class="mt-12 text-center space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
        <NuxtLink
          to="/products"
          class="inline-block bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition duration-300"
        >
          Alışverişe Devam Et
        </NuxtLink>
        <NuxtLink
          v-if="order"
          to="/profile/orders"
          class="inline-block border border-gray-300 text-gray-900 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition duration-300"
        >
          Siparişlerimi Görüntüle
        </NuxtLink>
      </div>

      <!-- Next Steps -->
      <div class="mt-12 max-w-4xl mx-auto bg-blue-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-blue-900 mb-4">Bundan Sonra Ne Olacak?</h3>
        <div class="space-y-3 text-sm text-blue-800">
          <div class="flex items-start space-x-3">
            <span class="flex-shrink-0 w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">1</span>
            <p>Siparişinizi hazırlama aşamasına alacağız ve size e-posta ile bilgi vereceğiz.</p>
          </div>
          <div class="flex items-start space-x-3">
            <span class="flex-shrink-0 w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">2</span>
            <p>Siparişiniz kargoya verildiğinde takip numaranızı e-posta ile göndereceğiz.</p>
          </div>
          <div class="flex items-start space-x-3">
            <span class="flex-shrink-0 w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">3</span>
            <p>Tahmini teslimat süresi 1-3 iş günüdür.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { checkoutHelper } from '~/utils/checkoutHelpers';

// SEO
useHead({
  title: 'Sipariş Başarılı - Sacrel',
  meta: [
    { name: 'description', content: 'Siparişiniz başarıyla alındı. Sipariş detaylarınızı görüntüleyin.' }
  ]
});

// Route params
const route = useRoute();
const orderId = route.params.id as string;

// Store references
const orders = useOrders();

// State
const order = ref<any>(null);
const isLoading = ref<boolean>(true);
const error = ref<string>('');

// Methods
const loadOrder = async () => {
  if (!orderId || orderId === 'success') {
    // Generic success page without specific order
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    const response = await orders.getOrder(orderId);
    order.value = response.order;
  } catch (err: any) {
    console.error('Failed to load order:', err);
    error.value = 'Sipariş yüklenemedi';
  } finally {
    isLoading.value = false;
  }
};

const formatPrice = (amount: number): string => {
  return checkoutHelper.formatPrice(amount);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};



const getItemTitle = (item: any): string => {
  return item.variant?.product?.title || item.title || 'Ürün';
};

const getItemVariant = (item: any): string => {
  const variant = item.variant;
  if (!variant?.options || !Array.isArray(variant.options)) return '';
  
  return variant.options
    .map((option: any) => option.value)
    .filter(Boolean)
    .join(' - ');
};

const getItemImage = (item: any): string => {
  const product = item.variant?.product;
  
  if (product?.thumbnail) {
    return product.thumbnail;
  }
  
  if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0].url || product.images[0];
  }
  
  // Return the SVG placeholder to avoid 404 requests
  return '/images/placeholder.svg';
};

// Load order on mount
onMounted(() => {
  loadOrder();
});
</script>
