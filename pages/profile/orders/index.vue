<template>
  <div class="min-h-screen  py-8">
    <div class="container mx-auto px-4">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Siparişlerim</h1>
        <p class="text-gray-600 mt-2">Geçmiş siparişlerinizi görüntüleyin ve takip edin</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="bg-white rounded-lg shadow-md p-6">
          <div class="animate-pulse">
            <div class="flex justify-between items-start mb-4">
              <div class="space-y-2">
                <div class="h-4 bg-gray-200 rounded w-32"></div>
                <div class="h-3 bg-gray-200 rounded w-24"></div>
              </div>
              <div class="h-6 bg-gray-200 rounded w-20"></div>
            </div>
            <div class="border-t border-gray-200 pt-4">
              <div class="flex space-x-4">
                <div class="h-16 w-16 bg-gray-200 rounded"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-gray-200 rounded"></div>
                  <div class="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Orders List -->
      <div v-else-if="orders.length > 0" class="space-y-6">
        <div
          v-for="order in orders"
          :key="order.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <!-- Order Header -->
          <div class="p-6 border-b border-gray-200">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div class="mb-4 sm:mb-0">
                <h3 class="text-lg font-semibold text-gray-900">
                  Sipariş #{{ order.display_id || order.id }}
                </h3>
                <p class="text-sm text-gray-600">
                  {{ formatDate(order.created_at) }}
                </p>
              </div>
              <div class="flex flex-col sm:items-end space-y-2">
                <span
                  :class="getStatusClass(order.status)"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ checkoutHelper.getOrderStatus(order.fulfillment_status) }}
                </span>
                <p class="text-lg font-semibold text-gray-900">
                  {{ checkoutHelper.formatPrice(order.total || order.subtotal || 0) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="p-6">
            <div class="space-y-4">
              <div
                v-for="item in order.items?.slice(0, 3)"
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
                  {{ checkoutHelper.formatPrice(item.total || (item.unit_price * item.quantity) || 0) }}
                </div>
              </div>
              
              <!-- Show more items indicator -->
              <div v-if="order.items && order.items.length > 3" class="text-sm text-gray-500 pt-2">
                +{{ order.items.length - 3 }} daha fazla ürün
              </div>
            </div>

            <!-- Order Actions -->
            <div class="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
              <NuxtLink
                :to="`/order/${order.id}`"
                class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition duration-300"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Detayları Gör
              </NuxtLink>
              
              <button
                v-if="canTrackOrder(order.status)"
                @click="trackOrder(order.id)"
                class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 transition duration-300"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Kargo Takip
              </button>

              <button
                v-if="canCancelOrder(order.status)"
                @click="openCancelModal(order)"
                class="inline-flex items-center justify-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition duration-300"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                İptal Talebi Oluştur
              </button>

              <button
                v-if="canReorder(order.status)"
                @click="reorderItems(order)"
                class="inline-flex items-center justify-center px-4 py-2 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-white hover:bg-green-50 transition duration-300"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Yeniden Sipariş Ver
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-lg shadow-md p-12 text-center">
        <div class="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Henüz Sipariş Yok</h3>
        <p class="text-gray-600 mb-6">Alışverişe başlayın ve siparişlerinizi burada takip edin.</p>
        <NuxtLink
          to="/products"
          class="inline-block bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition duration-300"
        >
          Alışverişe Başla
        </NuxtLink>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex justify-center">
        <nav class="flex space-x-2">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="loadOrders(page)"
            :class="[
              'px-3 py-2 text-sm font-medium rounded-md transition duration-300',
              currentPage === page
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Cancel Order Modal -->
    <div
      v-if="showCancelModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showCancelModal = false"></div>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Siparişi İptal Et</h3>
            <p class="text-sm text-gray-600 mb-4">
              #{{ selectedOrder?.display_id || selectedOrder?.id }} numaralı siparişinizi iptal etmek istediğinizden emin misiniz?
            </p>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">İptal Nedeni (Opsiyonel)</label>
              <textarea
                v-model="cancelReason"
                rows="3"
                class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="İptal nedeninizi yazabilirsiniz..."
              ></textarea>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="confirmCancelOrder"
              :disabled="isCancelling"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              {{ isCancelling ? 'İptal Ediliyor...' : 'Evet, İptal Et' }}
            </button>
            <button
              @click="showCancelModal = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Vazgeç
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { checkoutHelper } from '~/utils/checkoutHelpers';
import { useContact, type ContactData } from '@/composables/useContact';

const { createContactMessage } = useContact();

const customerStore = useCustomerStore();
const { currentCustomer } = storeToRefs(customerStore);

// SEO
useHead({
  title: 'Siparişlerim - Sacrel',
  meta: [
    { name: 'description', content: 'Geçmiş siparişlerinizi görüntüleyin ve takip edin.' }
  ]
});

// Auth check
definePageMeta({
  middleware: ['auth'] as any
});

// Store references
const orderService = useOrders();
const cart = useCart();

// State
const orders = ref<any[]>([]);
const isLoading = ref<boolean>(true);
const currentPage = ref<number>(1);
const totalPages = ref<number>(1);
const showCancelModal = ref<boolean>(false);
const selectedOrder = ref<any>(null);
const cancelReason = ref<string>('');
const isCancelling = ref<boolean>(false);

// Methods
const loadOrders = async (page: number = 1) => {
  try {
    isLoading.value = true;
    const limit = 3;
    const offset = (page - 1) * limit;
    
    const response = await orderService.getOrders({
      limit,
      offset,
      fields:'fulfillments,id,display_id,status,fulfillment_status,total,subtotal,created_at,currency,items',
    });
    console.log('Orders loaded:', response);
    
    // Process orders to ensure data consistency
    const processedOrders = (response.orders || []).map((order: any) => {
      // Ensure total is properly set
      if (!order.total && order.subtotal) {
        order.total = order.subtotal;
      }
      
      // Process items to ensure price data
      if (order.items && Array.isArray(order.items)) {
        order.items = order.items.map((item: any) => {
          if (!item.total && item.unit_price && item.quantity) {
            item.total = item.unit_price * item.quantity;
          }
          return item;
        });
      }
      
      return order;
    });
    
    orders.value = processedOrders;
    currentPage.value = page;
    totalPages.value = Math.ceil((response.count || 0) / limit);
  } catch (error) {
    console.error('Failed to load orders:', error);
    orders.value = [];
  } finally {
    isLoading.value = false;
  }
};



const formatDate = (dateString: string): string => {
  if (!dateString) return 'Bilinmeyen Tarih';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Geçersiz Tarih';
    }
    
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Tarih Hatası';
  }
};



const getStatusClass = (status: string): string => {
  const statusClasses: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    canceled: 'bg-red-100 text-red-800',
    requires_action: 'bg-orange-100 text-orange-800'
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800';
};

const getItemTitle = (item: any): string => {
  // Try different property paths for product title
  if (item.variant?.product?.title) {
    return item.variant.product.title;
  }
  if (item.product?.title) {
    return item.product.title;
  }
  if (item.title) {
    return item.title;
  }
  if (item.variant?.title) {
    return item.variant.title;
  }
  return 'Ürün';
};

const getItemVariant = (item: any): string => {
  const variant = item.variant;
  if (!variant) return '';
  
  // Try to get variant title first
  if (variant.title && variant.title !== 'Default Title') {
    return variant.title;
  }
  
  // If no title, try to build from options
  if (variant.options && Array.isArray(variant.options)) {
    const optionValues = variant.options
      .map((option: any) => option.value || option.option_value)
      .filter(Boolean);
    
    if (optionValues.length > 0) {
      return optionValues.join(' - ');
    }
  }
  
  // Try alternative option format
  if (variant.option_values && Array.isArray(variant.option_values)) {
    const optionValues = variant.option_values
      .map((optionValue: any) => optionValue.value)
      .filter(Boolean);
    
    if (optionValues.length > 0) {
      return optionValues.join(' - ');
    }
  }
  
  return '';
};

const getItemImage = (item: any): string => {
  // Try multiple paths for getting the product image
  const product = item.variant?.product || item.product;
  
  if (product?.thumbnail) {
    return product.thumbnail;
  }
  
  if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
    const firstImage = product.images[0];
    if (typeof firstImage === 'string') {
      return firstImage;
    }
    if (firstImage?.url) {
      return firstImage.url;
    }
  }
  
  // Try item-level thumbnail
  if (item.thumbnail) {
    return item.thumbnail;
  }
  
  // Try variant-level image
  if (item.variant?.image) {
    return item.variant.image;
  }
  
  // Return the SVG placeholder to avoid 404 requests
  return '/images/placeholder.svg';
};

const canTrackOrder = (status: string): boolean => {
  return ['shipped', 'completed'].includes(status);
};

const canReorder = (status: string): boolean => {
  return ['completed', 'delivered', 'canceled'].includes(status);
};

const trackOrder = async (orderId: string) => {
  try {
    await navigateTo(`/order/${orderId}#tracking`);
  } catch (error) {
    console.error('Failed to navigate to order tracking:', error);
  }
};

const openCancelModal = (order: any) => {
  // Check if customer data is available
  const customer = (currentCustomer.value as any)?.customer;
  if (!customer?.email) {
    alert('Müşteri bilgileri yüklenemedi. Lütfen sayfayı yenileyin ve tekrar deneyin.');
    return;
  }
  
  selectedOrder.value = order;
  showCancelModal.value = true;
  cancelReason.value = '';
};





const confirmCancelOrder = async () => {
  if (!selectedOrder.value) {
    console.error('No order selected for cancellation');
    return;
  }

  try {
    isCancelling.value = true;
    
    // Create a contact message for cancel request since there's no direct cancel API
    const customer = (currentCustomer.value as any)?.customer || {};
    
    // Validate required fields
    const customerEmail = customer?.email?.trim();
    if (!customerEmail) {
      alert('Müşteri e-posta adresi bulunamadı. Lütfen profil ayarlarınızdan e-posta adresinizi güncelleyin.');
      return;
    }
    
    const orderDisplayId = selectedOrder.value?.display_id || selectedOrder.value?.id;
    if (!orderDisplayId) {
      alert('Sipariş bilgisi eksik. Lütfen sayfayı yenileyin ve tekrar deneyin.');
      return;
    }
    
    const message = `Sayın Yetkili,

#${orderDisplayId} numaralı siparişimin iptal edilmesini talep ediyorum.

Müşteri Bilgileri:
- Ad Soyad: ${customer?.first_name || ''} ${customer?.last_name || ''}
- E-posta: ${customerEmail}
- Telefon: ${customer?.phone || 'Belirtilmemiş'}

İptal Nedeni: ${cancelReason.value?.trim() || 'Belirtilmemiş'}

Lütfen siparişimi iptal etmenizi rica ederim.

Teşekkürler.`;
    
    const contactData: ContactData = {
      name: `${customer?.first_name || ''} ${customer?.last_name || ''}`.trim() || 'Müşteri',
      email: customerEmail,
      phone: customer?.phone || '',
      subject: `Sipariş İptal Talebi - #${orderDisplayId}`,
      message: message,
      order_id: orderDisplayId,
    };

    // Validate the final contact data
    if (!contactData.email || !contactData.message) {
      console.error('Validation failed:', {
        email: contactData.email,
        emailLength: contactData.email?.length,
        message: contactData.message,
        messageLength: contactData.message?.length,
        fullContactData: contactData
      });
      alert('Gerekli bilgiler eksik. Lütfen profil bilgilerinizi kontrol edin.');
      return;
    }

    console.log('Sending contact data:', contactData);

    await createContactMessage(contactData);
    
    // Close modal and reset state
    showCancelModal.value = false;
    selectedOrder.value = null;
    cancelReason.value = '';
    
    alert('İptal talebiniz başarıyla gönderildi! En kısa sürede size dönüş yapılacaktır.');
    
    // Reload orders to get updated status
    await loadOrders(currentPage.value);
    
  } catch (error) {
    console.error('Sipariş iptal talebi gönderilirken hata oluştu:', error);
    
    // Check if it's a validation error
    if (error instanceof Error && error.message.includes('Validation error')) {
      alert('Gerekli bilgiler eksik veya hatalı. Lütfen profil bilgilerinizi kontrol edin ve tekrar deneyin.');
    } else {
      alert('İptal talebi gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  } finally {
    isCancelling.value = false;
  }
};
// canCancelOrder fonksiyonunu orderService'den kullan
const canCancelOrder = (status: string): boolean => {
  // Basit status kontrolü
  const cancellableStatuses = ['pending', 'requires_action', 'payment_required'];
  return cancellableStatuses.includes(status);
};

const reorderItems = async (order: any) => {
  try {
    // Get current cart or create new one
    let currentCart = await cart.getCurrentCart();
    
    if (!currentCart) {
      currentCart = await cart.createNewCart({});
    }
    
    // Add order items to cart
    for (const item of order.items) {
      if (item.variant?.id) {
        await cart.addItemToCart(item.variant.id, item.quantity);
      }
    }
    
    // Navigate to cart
    await navigateTo('/cart');
    
    // Show success message
    alert('Ürünler sepete eklendi!');
  } catch (error) {
    console.error('Failed to reorder items:', error);
    alert('Ürünler sepete eklenemedi. Lütfen tekrar deneyin.');
  }
};

// Load orders on mount
onMounted(async () => {
  // Ensure customer data is loaded
  if (!currentCustomer.value) {
    try {
      await customerStore.getCustomer();
    } catch (error) {
      console.error('Failed to load customer data:', error);
    }
  }
  
  loadOrders();
});
</script>