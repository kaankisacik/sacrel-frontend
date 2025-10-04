<template>
  <div class="min-h-screen">
    <!-- Header -->
    <div class="shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center space-x-4">
          <NuxtLink to="/cart" class="text-gray-600 hover:text-black">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </NuxtLink>
          <h1 class="text-2xl font-bold text-gray-900">Ödeme</h1>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="pageLoading" class="text-center py-12">
        <div
          class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"
        ></div>
        <p class="text-gray-600">Sayfa yükleniyor...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="pageError" class="text-center py-12">
        <div
          class="w-24 h-24 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center"
        >
          <svg
            class="w-12 h-12 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          Bir Hata Oluştu
        </h3>
        <p class="text-gray-600 mb-4">{{ pageError }}</p>
        <button
          @click="initializeCheckout"
          class="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-300"
        >
          Tekrar Dene
        </button>
      </div>

      <!-- Empty Cart Message -->
      <div v-else-if="isEmpty" class="text-center py-12">
        <div
          class="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center"
        >
          <svg
            class="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 9H6L5 9z"
            />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Sepetiniz boş</h2>
        <p class="text-gray-600 mb-6">
          Ödeme yapmak için sepetinizde ürün olmalıdır.
        </p>
        <NuxtLink
          to="/products"
          class="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition duration-300"
        >
          Alışverişe Başla
        </NuxtLink>
      </div>

      <!-- Checkout Content -->
      <div v-else>
        <!-- Step Indicator -->
        <CheckoutStepIndicator :current-step="checkoutState.step" />

        <!-- Error Banner -->
        <div
          v-if="checkoutState.error"
          class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <div class="flex items-center">
            <svg
              class="w-5 h-5 text-red-400 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p class="text-red-800">{{ checkoutState.error }}</p>
            <button
              @click="clearError"
              class="ml-auto text-red-600 hover:text-red-800"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Left Column - Forms -->
          <div class="space-y-6">
            <!-- Customer Information Step -->
            <div v-show="checkoutState.step === 'customer'">
              <CheckoutCustomerInfoForm
                key="customer-info-form"
                :customer-info="customerInfo"
                :saved-customer-info="savedCustomerInfo"
                @update:customerInfo="handleCustomerInfoUpdate"
                :is-loading="checkoutState.isLoading"
                @submit="handleCustomerInfoSubmit"
              />
            </div>

            <!-- Shipping Address Step -->
            <div v-show="checkoutState.step === 'shipping'">
              <CheckoutShippingForm
                :shipping-address="shippingAddress"
                @update:shipping-address="handleShippingAddressUpdate"
                :selected-shipping-option-id="selectedShippingOption"
                @update:selected-shipping-option-id="handleShippingOptionUpdate"
                :saved-addresses="savedAddresses"
                :shipping-options="shippingOptionsForForm"
                :customer-phone="customerInfo.phone"
                :is-loading="checkoutState.isLoading"
                :show-shipping-options="availableShippingOptions.length > 0"
                @submit="handleShippingSubmit"
                @previous="previousStep"
                @address-selected="handleAddressSelection"
                @shipping-option-selected="handleShippingOptionSelection"
                @load-shipping-options="handleLoadShippingOptions"
                @reset-user-selection="userSelectedShipping = false"
              />
            </div>

            <!-- Payment Method Step -->
            <div v-show="checkoutState.step === 'payment'">
              <CheckoutPaymentForm
                :selected-provider-id="selectedPaymentProvider"
                @update:selected-provider-id="handlePaymentProviderUpdate"
                :payment-data="paymentData"
                @update:payment-data="handlePaymentDataUpdate"
                :payment-providers="paymentProvidersForForm"
                :order-reference="orderReference"
                :order-total="orderSummary.pricing.total"
                :order-summary="orderSummary"
                :user-selected-shipping="userSelectedShipping"
                :is-loading="checkoutState.isLoading"
                :is-loading-providers="loadingPaymentProviders"
                @submit="handlePaymentSubmit"
                @previous="previousStep"
                @provider-selected="handlePaymentProviderSelection"
              />
            </div>

            <!-- Review Step -->
            <div
              v-show="checkoutState.step === 'review'"
              class="bg-white rounded-lg shadow-md p-6"
            >
              <h2 class="text-lg font-semibold text-gray-900 mb-6">
                Sipariş Onayı
              </h2>

              <!-- Customer Info Review -->
              <div class="mb-6">
                <h3 class="text-md font-medium text-gray-900 mb-2">
                  İletişim Bilgileri
                </h3>
                <div class="text-sm text-gray-600 space-y-1">
                  <p>
                    {{ customerInfo.firstName }} {{ customerInfo.lastName }}
                  </p>
                  <p>{{ customerInfo.email }}</p>
                  <p v-if="customerInfo.phone">{{ customerInfo.phone }}</p>
                </div>
                <button
                  @click="goToStep('customer')"
                  class="text-sm text-blue-600 hover:text-blue-800 mt-2"
                >
                  Düzenle
                </button>
              </div>

              <!-- Shipping Info Review -->
              <div class="mb-6">
                <h3 class="text-md font-medium text-gray-900 mb-2">
                  Teslimat Adresi
                </h3>
                <div class="text-sm text-gray-600 space-y-1">
                  <p>{{ checkoutHelper.formatAddress(shippingAddress) }}</p>
                  <p v-if="selectedShippingOptionName" class="font-medium">
                    Kargo: {{ selectedShippingOptionName }}
                  </p>
                </div>
                <button
                  @click="goToStep('shipping')"
                  class="text-sm text-blue-600 hover:text-blue-800 mt-2"
                >
                  Düzenle
                </button>
              </div>

              <!-- Payment Info Review -->
              <div class="mb-6">
                <h3 class="text-md font-medium text-gray-900 mb-2">
                  Ödeme Yöntemi
                </h3>
                <div class="text-sm text-gray-600">
                  <p>
                    {{
                      checkoutHelper.getPaymentMethodName(
                        selectedPaymentProvider
                      )
                    }}
                  </p>
                  <p v-if="paymentData.data?.cardNumber" class="text-xs mt-1">
                    **** **** **** {{ paymentData.data?.cardNumber?.slice(-4) }}
                  </p>
                </div>
                <button
                  @click="goToStep('payment')"
                  class="text-sm text-blue-600 hover:text-blue-800 mt-2"
                >
                  Düzenle
                </button>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-between pt-6 border-t">
                <button
                  @click="previousStep"
                  class="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition duration-300"
                >
                  Geri
                </button>

                <button
                  @click="handleOrderCompletionNewWay"
                  :disabled="!canProceedToNextStep || checkoutState.isLoading"
                  class="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{
                    checkoutState.isLoading
                      ? "Sipariş Veriliyor..."
                      : getCompleteButtonText()
                  }}
                </button>
              </div>
            </div>
          </div>

          <!-- Right Column - Order Summary -->
          <div class="lg:col-span-1">
            <CheckoutOrderSummary
              :summary="orderSummary"
              :cod-fee="codExtraFee"
              :show-cod-fee="showCodFee"
              :show-actions="false"
              :is-loading="!cart || checkoutState.isLoading"
              :order-reference="orderReference"
              :selected-shipping-method-name="selectedShippingOptionName"
              :user-selected-shipping="userSelectedShipping"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 3DS Modal -->
    <div v-if="show3DSModal && threeDSHtml" class="fixed top-0 inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0;">
      <div class="bg-white rounded-lg shadow-lg p-0 relative w-full max-w-lg flex flex-col items-center">
        <button @click="close3DSModal"
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold">&times;</button>
        <iframe :srcdoc="threeDSHtml" style="width: 100%; height: 560px; border: 0" class="rounded-b-lg"></iframe>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { checkoutHelper, type CheckoutSummary } from "~/utils/checkoutHelpers";

// Components
import CheckoutStepIndicator from "~/components/checkout/StepIndicator.vue";
import CheckoutCustomerInfoForm from "~/components/checkout/CustomerInfoForm.vue";
import CheckoutShippingForm from "~/components/checkout/ShippingForm.vue";
import CheckoutPaymentForm from "~/components/checkout/PaymentForm.vue";
import CheckoutOrderSummary from "~/components/checkout/OrderSummary.vue";

// SEO
useHead({
  title: "Ödeme - Sacrel",
  meta: [
    {
      name: "description",
      content: "Siparişinizi tamamlayın ve güvenli ödeme yapın.",
    },
  ],
});

// Store references
const cartStore = useCartStore();
const customerStore = useCustomerStore();
const { cart } = storeToRefs(cartStore);

// Composables
const checkout = useCheckout();
const router = useRouter();

// Destructure checkout composable
const {
  state: checkoutState,
  customerInfo,
  shippingAddress,
  paymentData,
  availableShippingOptions,
  availablePaymentProviders,
  selectedShippingOption,
  selectedPaymentProvider,
  canProceedToNextStep,
  isShippingAddressValid,
  goToStep,
  nextStep,
  previousStep,
  updateCheckoutCustomerInfo,
  updateCheckoutShippingAddress,
  addCheckoutShippingMethod,
  loadShippingOptions,
  loadPaymentProviders,
  initializePaymentSessions,
  completeCheckout,
  resetCheckout,
} = checkout;

// Local state
const pageLoading = ref<boolean>(false);
const pageError = ref<string>("");
const savedAddresses = ref<any[]>([]);
const savedCustomerInfo = ref<any>(null);
const orderReference = ref<string>("");
const codExtraFee = ref<number>(500); // 5 TL in kuruş
const loadingPaymentProviders = ref<boolean>(false);
const componentMounted = ref<boolean>(false);

// 3DS Modal state
const show3DSModal = ref<boolean>(false);
const threeDSHtml = ref<string>("");
const paymentId = ref<string>("");
const conversationId = ref<string>("");

// Control flags
const isInitializing = ref<boolean>(false);
let isSubmittingCustomer = false;
let isSubmittingShipping = false;
const userSelectedShipping = ref<boolean>(false);

// Global initialization tracker to prevent multiple instances
const globalInitialization = {
  isInProgress: false,
  promise: null as Promise<void> | null,
};

// Computed properties
const isEmpty = computed(() => {
  if (!cart.value?.cart) return true;
  if (!cart.value.cart.items) return true;
  return cart.value.cart.items.length === 0;
});

const orderSummary = computed((): CheckoutSummary => {
  if (!cart.value?.cart) {
    return {
      items: [],
      pricing: { subtotal: 0, tax: 0, shipping: 0, discount: 0, total: 0 },
      itemCount: 0,
    };
  }

  return checkoutHelper.calculateCheckoutSummary(cart.value.cart);
});

const showCodFee = computed(() => {
  return selectedPaymentProvider.value === "cash_on_delivery";
});

const selectedShippingOptionName = computed(() => {
  const option = availableShippingOptions.value.find(
    (opt: any) => opt.id === selectedShippingOption.value
  );
  return option ? checkoutHelper.getShippingMethodName(option) : "";
});

// Computed arrays to avoid readonly issues
const shippingOptionsForForm = computed(() => [
  ...availableShippingOptions.value,
]);
const paymentProvidersForForm = computed(() => [
  ...availablePaymentProviders.value,
]);

// Methods
const initializeCheckout = async () => {
  // Check if another instance is already initializing
  if (globalInitialization.isInProgress) {
    if (globalInitialization.promise) {
      try {
        await globalInitialization.promise;
      } catch (error) {
        console.error("Waiting for global initialization failed:", error);
      }
    }
    return;
  }

  // Prevent multiple simultaneous initialization calls
  if (isInitializing.value || pageLoading.value) {
    return;
  }

  try {
    // Set global and local flags
    globalInitialization.isInProgress = true;
    isInitializing.value = true;
    pageLoading.value = true;
    pageError.value = "";

    // Create a promise for other instances to wait for
    globalInitialization.promise = (async () => {
      // Initialize cart if needed
      if (!cart.value) {
        await cartStore.initializeCart();
        await nextTick();
      }

      // Check if cart is empty after initialization
      if (isEmpty.value) {
        return;
      }

      // Generate order reference
      orderReference.value = (cart.value?.cart?.id)?.split("_")[1] || "";

      // Load customer addresses if logged in
      try {
        await customerStore.getCustomer(); // This will also load customer info
        await customerStore.getCustomerAddresses();
        savedAddresses.value =
          customerStore.currentCustomerAddresses.addresses || [];
        
        // Set saved customer info
        if (customerStore.currentCustomer?.customer) {
          savedCustomerInfo.value = customerStore.currentCustomer.customer;
        }
      } catch (error) {
        // User might not be logged in, continue without saved addresses
        console.log("User not logged in, continuing without saved data");
      }

      // Load payment providers for current region
      if (cart.value?.cart?.region_id) {
        loadingPaymentProviders.value = true;
        try {
          await loadPaymentProviders(cart.value.cart.region_id);
        } catch (error) {
          console.error("Failed to load payment providers:", error);
        } finally {
          loadingPaymentProviders.value = false;
        }
      }
    })();

    await globalInitialization.promise;
  } catch (error: any) {
    console.error("Failed to initialize checkout:", error);
    pageError.value = checkoutHelper.formatErrorMessage(error);
  } finally {
    // Always ensure loading is stopped and flags are reset
    pageLoading.value = false;
    isInitializing.value = false;
    globalInitialization.isInProgress = false;
    globalInitialization.promise = null;
  }
};

const clearError = () => {
  checkoutState.value.error = null;
};

// 3DS Modal functions
const open3DSModal = (html: string, pId: string, cId: string) => {
  threeDSHtml.value = html;
  paymentId.value = pId;
  conversationId.value = cId;
  show3DSModal.value = true;
};

const close3DSModal = () => {
  show3DSModal.value = false;
  threeDSHtml.value = "";
  paymentId.value = "";
  conversationId.value = "";
};

// Data update handlers
const handleCustomerInfoUpdate = (newCustomerInfo: any) => {
  // Prevent recursive updates by checking if the data is actually different
  if (JSON.stringify(customerInfo.value) !== JSON.stringify(newCustomerInfo)) {
    customerInfo.value = newCustomerInfo;
  }
};

const handleShippingAddressUpdate = (newShippingAddress: any) => {
  // Prevent recursive updates by checking if the data is actually different
  if (
    JSON.stringify(shippingAddress.value) !== JSON.stringify(newShippingAddress)
  ) {
    shippingAddress.value = newShippingAddress;
  }
};

const handleShippingOptionUpdate = (newShippingOption: string) => {
  // Prevent recursive updates by checking if the data is actually different
  if (selectedShippingOption.value !== newShippingOption) {
    selectedShippingOption.value = newShippingOption;
  }
};

const handlePaymentProviderUpdate = (newPaymentProvider: string) => {
  // Prevent recursive updates by checking if the data is actually different
  if (selectedPaymentProvider.value !== newPaymentProvider) {
    selectedPaymentProvider.value = newPaymentProvider;
  }
};

const handlePaymentDataUpdate = (newPaymentData: any) => {
  // Prevent recursive updates by checking if the data is actually different
  if (JSON.stringify(paymentData.value) !== JSON.stringify(newPaymentData)) {
    paymentData.value = newPaymentData;
  }
};

// Step handlers
const handleCustomerInfoSubmit = async (customerData: any) => {
  // Prevent multiple simultaneous submissions
  if (isSubmittingCustomer || checkoutState.value.isLoading) return;

  try {
    isSubmittingCustomer = true;

    if (!cart.value?.cart?.id) return;

    await updateCheckoutCustomerInfo(cart.value.cart.id);
    nextStep();
  } catch (error: any) {
    // Handle error by setting page error instead of checkout state error
    console.error("Customer info submit error:", error);
  } finally {
    isSubmittingCustomer = false;
  }
};

const handleShippingSubmit = async (data: {
  address: any;
  shippingOptionId: string;
}) => {
  console.log("Handling shipping submit with data:", data);

  // Prevent multiple simultaneous submissions
  if (isSubmittingShipping) return;

  try {
    console.log("Submitting shipping information...");

    isSubmittingShipping = true;
    isLoadingShippingOptions = true;

    if (!cart.value?.cart?.id) {
      console.error("No cart ID available");
      return;
    }

    console.log("Cart ID:", cart.value.cart.id);

    // Update shipping address first
    await updateCheckoutShippingAddress(cart.value.cart.id);
    console.log("Shipping address updated");

    // Add shipping method only once
    if (data.shippingOptionId) {
      console.log("Adding shipping method...");
      await addCheckoutShippingMethod(
        cart.value.cart.id,
        data.shippingOptionId
      );
      console.log("Shipping method added:", data.shippingOptionId);

      // Refresh cart to verify shipping method was added
      await cartStore.getCart();
      console.log("Cart after adding shipping method:", cart.value);
    }

    // Wait for next tick to ensure all reactive updates are processed
    await nextTick();

    // Check validation before proceeding
    const canProceed = canProceedToNextStep.value;
    console.log("Can proceed to next step:", canProceed);

    if (!canProceed) {
      console.error("Cannot proceed: validation failed");
      checkoutState.value.error =
        "Lütfen tüm gerekli alanları doldurun ve kargo seçeneği seçin.";
      return;
    }

    console.log("Proceeding to next step");
    nextStep();
  } catch (error: any) {
    console.error("Shipping submit error:", error);
    checkoutState.value.error =
      checkoutHelper.formatErrorMessage(error) ||
      "Teslimat bilgileri kaydedilirken bir hata oluştu.";
  } finally {
    isSubmittingShipping = false;
    setTimeout(() => {
      isLoadingShippingOptions = false;
    }, 100);
  }
};

const handlePaymentSubmit = async (data: {
  providerId: string;
  paymentData: any;
}) => {
  console.log("=== HANDLE PAYMENT SUBMIT CALLED ===");
  console.log("Received data:", data);

  try {
    if (!cart.value) {
      console.log("❌ No cart available");
      return;
    }

    console.log("Current checkout state before submit:", {
      step: checkoutState.value.step,
      selectedPaymentProvider: selectedPaymentProvider.value,
      paymentData: paymentData.value,
      canProceedToNextStep: canProceedToNextStep.value,
    });

    // Update payment data first
    console.log("Updating payment data...");
    paymentData.value = {
      method: data.providerId,
      provider: data.providerId,
      data: data.paymentData,
    };

    selectedPaymentProvider.value = data.providerId;

    console.log("Updated checkout state:", {
      selectedPaymentProvider: selectedPaymentProvider.value,
      paymentData: paymentData.value,
      canProceedToNextStep: canProceedToNextStep.value,
    });

    // Initialize payment sessions
    console.log("Initializing payment sessions...");
    await initializePaymentSessions(cart.value);

    console.log("Calling nextStep...");
    nextStep();

    console.log("✅ Payment submit completed successfully");
  } catch (error: any) {
    console.error("❌ Payment submit error:", error);
  }
};

const handleOrderCompletion = async () => {
  try {
    if (!cart.value?.cart?.id) return;

    const response = await completeCheckout(cart.value.cart.id);

    // Clear checkout state
    resetCheckout();

    // Redirect to success page
    const orderId = response.order?.id || "success";
    await router.push(`/order/${orderId}`);
  } catch (error: any) {
    console.error("Order completion error:", error);
  }
};

// 3DS Ödeme Başlatma Fonksiyonu
const handleOrderCompletionNewWay = async () => {
  try {
    checkoutState.value.isLoading = true;
    checkoutState.value.error = null;

    if (!cart.value?.cart) {
      throw new Error("Sepet bulunamadı");
    }

    // useIyzicoPayment composable'ını kullan
    const { processPayment } = useIyzicoPayment();

    // Kart bilgilerini payment data'dan al
    const expiryParts = paymentData.value.data?.expiryDate?.split('/') || [];
    const expireMonth = expiryParts[0] || "";
    const expireYear = expiryParts[1] ? `20${expiryParts[1]}` : "";
    
    const cardInfo = {
      cardHolderName: paymentData.value.data?.cardName || "",
      cardNumber: (paymentData.value.data?.cardNumber || "").replace(/\s/g, ""),
      expireMonth: expireMonth,
      expireYear: expireYear,
      cvc: paymentData.value.data?.cvv || ""
    };

    // Kart bilgilerini validate et
    if (!cardInfo.cardHolderName || cardInfo.cardHolderName.length < 2) {
      throw new Error("Kart sahibi adı en az 2 karakter olmalıdır.");
    }
    if (!cardInfo.cardNumber || cardInfo.cardNumber.length < 13) {
      throw new Error("Kart numarası geçersiz.");
    }
    if (!cardInfo.expireMonth || cardInfo.expireMonth.length < 1) {
      throw new Error("Son kullanma ayı geçersiz.");
    }
    if (!cardInfo.expireYear || cardInfo.expireYear.length < 4) {
      throw new Error("Son kullanma yılı geçersiz.");
    }
    if (!cardInfo.cvc || cardInfo.cvc.length < 3) {
      throw new Error("CVC kodu geçersiz.");
    }

    // Müşteri bilgilerini buyer formatına çevir
    const buyerInfo = {
      id: customerInfo.value.email || "BUYER001",
      name: customerInfo.value.firstName || "Ad",
      surname: customerInfo.value.lastName || "Soyad",
      identityNumber: "11111111111", // Test değeri
      email: customerInfo.value.email || "test@test.com",
      gsmNumber: customerInfo.value.phone || "+905350000000",
      registrationDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      lastLoginDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      registrationAddress: checkoutHelper.formatAddress(shippingAddress.value),
      city: shippingAddress.value.city || "Istanbul", // İl/Şehir bilgisini city alanına gönder
      country: "Turkey",
      zipCode: shippingAddress.value.postalCode || "34000",
    };

    // Basket items oluştur (cart'tan ürünleri al)
    const basketItems: Array<{
      id: string;
      price: string;
      name: string;
      category1: string;
      category2?: string;
      itemType: 'PHYSICAL' | 'VIRTUAL';
    }> = cart.value.cart.items?.map((item, index) => {
      const totalItemPrice = (item.unit_price || 0) * (item.quantity || 1);
      const itemPrice = (totalItemPrice).toFixed(2);
      
      return {
        id: item.id || `BI${index + 1}`,
        price: itemPrice,
        name: item.title || `Ürün ${index + 1}`,
        category1: "Giyim",
        itemType: "PHYSICAL" as 'PHYSICAL',
      };
    }) || [];

    // Kargo ücreti varsa basket items'a ekle
    if (userSelectedShipping.value && orderSummary.value.pricing.shipping > 0) {
      const shippingPrice = (orderSummary.value.pricing.shipping).toFixed(2);
      basketItems.push({
        id: "SHIPPING",
        name: "Kargo",
        category1: "Lojistik",
        itemType: "VIRTUAL" as 'VIRTUAL',
        price: shippingPrice,
      });
    }

    // Toplam tutarı hesapla (kargo dahil)
    const totalWithShipping = orderSummary.value.pricing.total + (userSelectedShipping.value ? orderSummary.value.pricing.shipping : 0);
    const totalAmount = (totalWithShipping).toFixed(2);

    console.log("3DS ödeme başlatılıyor...", {
      totalAmount,
      buyerInfo,
      basketItems
    });

    // 3DS ödeme işlemini başlat
    const result = await processPayment({
      card: cardInfo,
      amount: totalAmount,
      buyer: buyerInfo,
      basketItems: basketItems,
      cartId: cart.value?.cart?.id || ""
    });

    if (result.success && result.data) {
      console.log("3DS başlatma başarılı");

      paymentId.value = result.data.paymentId || "";
      conversationId.value = result.data.conversationId || "";

      // 3DS HTML içeriğini modal'da göster
      open3DSModal(result.data.threeDSHtml, paymentId.value, conversationId.value);

      console.log("3DS modal açıldı");
    } else {
      throw new Error(result.error || '3DS başlatma başarısız');
    }

  } catch (error: any) {
    console.error('3DS Init Error:', error);
    checkoutState.value.error = `Ödeme başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`;
  } finally {
    checkoutState.value.isLoading = false;
  }
};

// Event handlers
const handleAddressSelection = async (addressId: string) => {
  const selectedAddress = savedAddresses.value.find(
    (addr) => addr.id === addressId
  );
  if (!selectedAddress) return;

  try {
    // Clear previous shipping option selection when selecting a new address
    selectedShippingOption.value = "";
    userSelectedShipping.value = false; // Reset user selection flag
    console.log("kaan: Address selected:", selectedAddress);

    // Map saved address to shipping address format
    const newAddress = {
      address_1: selectedAddress.address_1,
      city: selectedAddress.city,
      district: selectedAddress.metadata.district || "",
      postalCode: selectedAddress.postal_code || "",
      countryCode: "tr",
      phone: selectedAddress.phone || "",
    };

    // Update address
    Object.assign(shippingAddress.value, newAddress);

    // Load shipping options immediately for saved addresses
    if (cart.value?.cart?.id) {
      await loadShippingOptionsManually(cart.value.cart.id);
    }
  } catch (error) {
    console.error("Failed to handle address selection:", error);
  }
};

const handleShippingOptionSelection = (optionId: string) => {
  selectedShippingOption.value = optionId;
  userSelectedShipping.value = true; // Mark as user-selected
};

const handleLoadShippingOptions = async () => {
  if (!cart.value?.cart?.id) return;

  // Clear previous shipping option selection when loading new options
  selectedShippingOption.value = "";
  userSelectedShipping.value = false; // Reset user selection flag

  await loadShippingOptionsManually(cart.value.cart.id);
};

const handlePaymentProviderSelection = (providerId: string) => {
  selectedPaymentProvider.value = providerId;

  // Clear payment data when provider changes
  paymentData.value = {
    method: "",
    provider: providerId,
    data: {},
  };
};

// Helper methods
const getCompleteButtonText = (): string => {
  switch (selectedPaymentProvider.value) {
    case "stripe":
    case "credit_card":
      return "Kartla Öde";
    case "bank_transfer":
      return "Sipariş Ver (Havale)";
    case "cash_on_delivery":
      return "Kapıda Öde";
    default:
      return "Siparişi Tamamla";
  }
};

// Watchers and shipping options handling
let isLoadingShippingOptions = false;

// Manual shipping options loading - called when needed
const loadShippingOptionsManually = async (cartId: string) => {
  if (
    isLoadingShippingOptions ||
    isInitializing.value ||
    !componentMounted.value
  )
    return;

  try {
    isLoadingShippingOptions = true;
    console.log("Loading shipping options manually...");
    await loadShippingOptions(cartId);
  } catch (error) {
    console.error("Failed to load shipping options:", error);
  } finally {
    isLoadingShippingOptions = false;
  }
};

// Initialize on mount with defensive checks
const initializationId = ref(Math.random().toString(36).substring(7));

// PostMessage handler for 3DS payment results
const handlePaymentMessage = (event: MessageEvent) => {
  console.log('Received payment message:', event.data);

  if (event.data.type === 'payment_completed') {
    console.log('Payment completed:', event.data);

    // Modal'ı kapat
    close3DSModal();

    // Ödeme sonucuna göre işlem yap
    if (event.data.status === 'success') {
      console.log('Ödeme başarıyla tamamlandı! Order ID:', event.data.orderId);
      
      // Başarılı ödeme sonrası cart'ı temizle
      const { clearCurrentCart } = useCart();
      clearCurrentCart();
      console.log('Cart cleared after successful payment');
      
      // Cart store'u da temizle
      cartStore.clearCart();
      
      // Başarılı ödeme - order success sayfasına yönlendir
      if (event.data.orderId) {
        router.push(`/order/${event.data.orderId}`);
      } else {
        // Order ID yoksa genel başarı mesajı göster
        checkoutState.value.error = null;
        console.log('Ödeme başarılı ancak sipariş ID bulunamadı');
        // Ana sayfaya yönlendir veya başka bir işlem yap
        router.push('/');
      }
    } else if (event.data.status === 'failure') {
      // Başarısız ödeme - checkout'ta kal ve hata mesajı göster
      checkoutState.value.error = 'Ödeme başarısız oldu. Lütfen kart bilgilerinizi kontrol edip tekrar deneyin.';
      console.log('Ödeme başarısız oldu.');
    }
  } else if (event.data.type === 'close_modal') {
    // Modal'ı kapat
    console.log('Closing payment modal');
    close3DSModal();
  }
};

onMounted(async () => {
  // Use nextTick to ensure component is fully mounted
  await nextTick();
  componentMounted.value = true;

  // PostMessage listener ekle
  if (process.client && typeof window !== 'undefined') {
    window.addEventListener('message', handlePaymentMessage);
  }

  // If cart is already available and empty, don't show loading
  if (cart.value && isEmpty.value) {
    pageLoading.value = false;
    return;
  }

  // Only initialize if not already initializing and component is still mounted
  if (!isInitializing.value && componentMounted.value) {
    await initializeCheckout();
  }
});

// Cleanup on unmount
onUnmounted(() => {
  componentMounted.value = false;

  // PostMessage listener'ı kaldır
  if (process.client && typeof window !== 'undefined') {
    window.removeEventListener('message', handlePaymentMessage);
  }

  // Reset checkout state
  resetCheckout();

  // Reset user selection flag
  userSelectedShipping.value = false;
});
</script>
