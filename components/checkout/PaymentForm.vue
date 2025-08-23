<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Ödeme Yöntemi</h2>

    <!-- Loading State -->
    <div v-if="isLoadingProviders" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
      <p class="text-gray-600">Ödeme seçenekleri yükleniyor...</p>
    </div>

    <!-- Payment Providers -->
    <div v-else-if="paymentProviders.length > 0" class="space-y-4">
      <!-- Payment Method Selection -->
      <div class="space-y-3 mb-6">
        <label
          v-for="provider in paymentProviders"
          :key="provider.id"
          class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          :class="{ 'border-black bg-gray-50': selectedProviderId === provider.id }"
        >
          <input
            v-model="selectedProviderId"
            type="radio"
            :value="provider.id"
            class="text-black focus:ring-black"
            @change="onProviderChange"
          />
          <span class="ml-3 font-medium">
            {{ checkoutHelper.getPaymentMethodIcon(provider.id) }}
            {{ checkoutHelper.getPaymentMethodName(provider.id) }}
          </span>
        </label>
      </div>

      <!-- Payment Method Components -->
      <div v-if="selectedProviderId" class="border-t pt-6">
        <!-- Debug Info -->
        <div class="mb-4 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs">
          <p><strong>Debug:</strong> Selected Provider: {{ selectedProviderId }}</p>
          <p><strong>Payment Method:</strong> {{ localPaymentData.method }}</p>
          <p><strong>Is Credit Card:</strong> {{ isCreditCardProvider(selectedProviderId) }}</p>
          <p><strong>Available Providers:</strong> {{ paymentProviders.map(p => p.id).join(', ') }}</p>
          <p><strong>Form Valid:</strong> {{ isFormValid }}</p>
        </div>
        
        <!-- Credit Card Form -->
        <div v-if="isCreditCardProvider(selectedProviderId)" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <label for="cardNumber" class="block text-sm font-medium text-gray-700 mb-1">
                Kart Numarası <span class="text-red-500">*</span>
              </label>
              <input
                id="cardNumber"
                v-model="formattedCardNumber"
                type="text"
                class="w-full px-3 py-2 border rounded-md focus:ring-black focus:border-black transition-colors"
                :class="getFieldClasses('cardNumber')"
                placeholder="1234 5678 9012 3456"
                maxlength="19"
                :disabled="isLoading"
                @blur="validateField('cardNumber')"
              />
              <p v-if="errors.cardNumber" class="mt-1 text-sm text-red-600">
                {{ errors.cardNumber }}
              </p>
            </div>
            
            <div>
              <label for="expiryDate" class="block text-sm font-medium text-gray-700 mb-1">
                Son Kullanma <span class="text-red-500">*</span>
              </label>
              <input
                id="expiryDate"
                v-model="formattedExpiryDate"
                type="text"
                class="w-full px-3 py-2 border rounded-md focus:ring-black focus:border-black transition-colors"
                :class="getFieldClasses('expiryDate')"
                placeholder="MM/YY"
                maxlength="5"
                :disabled="isLoading"
                @blur="validateField('expiryDate')"
              />
              <p v-if="errors.expiryDate" class="mt-1 text-sm text-red-600">
                {{ errors.expiryDate }}
              </p>
            </div>
            
            <div>
              <label for="cvv" class="block text-sm font-medium text-gray-700 mb-1">
                CVV <span class="text-red-500">*</span>
              </label>
              <input
                id="cvv"
                v-model="localPaymentData.cvv"
                type="text"
                class="w-full px-3 py-2 border rounded-md focus:ring-black focus:border-black transition-colors"
                :class="getFieldClasses('cvv')"
                placeholder="123"
                maxlength="4"
                :disabled="isLoading"
                @blur="validateField('cvv')"
              />
              <p v-if="errors.cvv" class="mt-1 text-sm text-red-600">
                {{ errors.cvv }}
              </p>
            </div>
            
            <div class="sm:col-span-2">
              <label for="cardName" class="block text-sm font-medium text-gray-700 mb-1">
                Kart Üzerindeki İsim <span class="text-red-500">*</span>
              </label>
              <input
                id="cardName"
                v-model="localPaymentData.cardName"
                type="text"
                class="w-full px-3 py-2 border rounded-md focus:ring-black focus:border-black transition-colors"
                :class="getFieldClasses('cardName')"
                placeholder="Kart sahibinin adı soyadı"
                :disabled="isLoading"
                @blur="validateField('cardName')"
              />
              <p v-if="errors.cardName" class="mt-1 text-sm text-red-600">
                {{ errors.cardName }}
              </p>
            </div>
          </div>
        </div>

        <!-- Bank Transfer Info -->
        <div v-else-if="selectedProviderId === 'bank_transfer'" class="space-y-4">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 class="font-medium text-blue-900 mb-2">Banka Bilgileri</h3>
            <p class="text-sm text-blue-800 mb-2">Sipariş numaranız: {{ orderReference }}</p>
            <div class="text-sm text-blue-800">
              <p><strong>Banka:</strong> Örnek Bankası</p>
              <p><strong>IBAN:</strong> TR12 3456 7890 1234 5678 9012 34</p>
              <p><strong>Açıklama:</strong> Sipariş No: {{ orderReference }}</p>
            </div>
          </div>
        </div>

        <!-- Cash on Delivery Info -->
        <div v-else-if="selectedProviderId === 'cash_on_delivery'" class="space-y-4">
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 class="font-medium text-yellow-900 mb-2">Kapıda Ödeme</h3>
            <p class="text-sm text-yellow-800 mb-3">
              Siparişiniz kapınıza geldiğinde ödeme yapabilirsiniz.
            </p>

            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  v-model="localPaymentData.codOption"
                  type="radio"
                  value="cash"
                  class="text-yellow-600 focus:ring-yellow-500"
                />
                <span class="ml-2 text-sm text-yellow-800">Nakit</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="localPaymentData.codOption"
                  type="radio"
                  value="card"
                  class="text-yellow-600 focus:ring-yellow-500"
                />
                <span class="ml-2 text-sm text-yellow-800">Kredi/Banka Kartı</span>
              </label>
            </div>

            <div class="mt-3 p-2 bg-yellow-100 rounded text-xs text-yellow-700">
              <p>Kapıda ödeme için ekstra ücret uygulanabilir.</p>
            </div>
          </div>
        </div>

        <!-- Generic Payment Provider -->
        <div v-else class="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 class="font-medium text-gray-900 mb-2">
            {{ checkoutHelper.getPaymentMethodName(selectedProviderId) }}
          </h3>
          <p class="text-sm text-gray-600">
            Ödeme sağlayıcısına yönlendirileceksiniz.
          </p>
        </div>
      </div>
    </div>

    <!-- No Payment Providers -->
    <div v-else class="text-center py-8">
      <div class="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Ödeme Seçeneği Bulunamadı</h3>
      <p class="text-gray-600">Lütfen daha sonra tekrar deneyin.</p>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex justify-between pt-6 border-t mt-6">
      <button
        type="button"
        @click="$emit('previous')"
        class="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition duration-300"
      >
        Geri
      </button>
      
      <button
        type="button"
        @click="handleNext"
        :disabled="!selectedProviderId || isLoading || !isFormValid"
        class="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isLoading ? 'Yükleniyor...' : 'Sipariş Özetine Geç' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { checkoutHelper } from '~/utils/checkoutHelpers';

interface PaymentProvider {
  id: string;
  name?: string;
}

interface PaymentData {
  provider: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardName?: string;
  codOption?: string;
}

interface Props {
  paymentProviders: any[];
  selectedProviderId: string;
  paymentData: any;
  orderReference: string;
  isLoading?: boolean;
  isLoadingProviders?: boolean;
}

interface Emits {
  (e: 'update:selectedProviderId', value: string): void;
  (e: 'update:paymentData', value: any): void;
  (e: 'submit', data: { providerId: string; paymentData: any }): void;
  (e: 'previous'): void;
  (e: 'providerSelected', providerId: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  isLoadingProviders: false,
});

const emit = defineEmits<Emits>();

// Local state
const selectedProviderId = ref<string>(props.selectedProviderId);
const localPaymentData = ref<any>({ ...props.paymentData });
const errors = ref<Record<string, string>>({});
const touchedFields = ref<Set<string>>(new Set());

// Computed
const formattedCardNumber = computed({
  get: () => localPaymentData.value.cardNumber || '',
  set: (value: string) => {
    localPaymentData.value.cardNumber = checkoutHelper.formatCardNumber(value);
  },
});

const formattedExpiryDate = computed({
  get: () => localPaymentData.value.expiryDate || '',
  set: (value: string) => {
    localPaymentData.value.expiryDate = checkoutHelper.formatExpiryDate(value);
  },
});

const isFormValid = computed(() => {
  console.log('isFormValid check:', {
    selectedProviderId: selectedProviderId.value,
    isCreditCard: isCreditCardProvider(selectedProviderId.value),
    localPaymentData: localPaymentData.value,
    errorsCount: Object.keys(errors.value).length
  });
  
  if (!selectedProviderId.value) {
    console.log('No provider selected');
    return false;
  }
  
  if (isCreditCardProvider(selectedProviderId.value)) {
    const isValid = Boolean(
      localPaymentData.value.cardNumber &&
      localPaymentData.value.expiryDate &&
      localPaymentData.value.cvv &&
      localPaymentData.value.cardName &&
      Object.keys(errors.value).length === 0
    );
    console.log('Credit card validation:', {
      cardNumber: !!localPaymentData.value.cardNumber,
      expiryDate: !!localPaymentData.value.expiryDate,
      cvv: !!localPaymentData.value.cvv,
      cardName: !!localPaymentData.value.cardName,
      errorsCount: Object.keys(errors.value).length,
      isValid
    });
    return isValid;
  }
  
  if (selectedProviderId.value === 'cash_on_delivery') {
    const isValid = Boolean(localPaymentData.value.codOption);
    console.log('COD validation:', { codOption: localPaymentData.value.codOption, isValid });
    return isValid;
  }
  
  // For other payment methods (bank transfer, etc.)
  console.log('Other payment method - returning true');
  return true;
});

// Watchers - simplified and efficient
watch(
  () => props.selectedProviderId,
  (newValue) => {
    selectedProviderId.value = newValue;
  }
);

watch(
  () => props.paymentData,
  (newValue) => {
    localPaymentData.value = { ...newValue };
  },
  { deep: true }
);

watch(
  selectedProviderId,
  (newValue) => {
    emit('update:selectedProviderId', newValue);
    localPaymentData.value.provider = newValue;
    localPaymentData.value.method = newValue;
  }
);

watch(
  localPaymentData,
  (newValue) => {
    emit('update:paymentData', newValue);
    checkoutHelper.saveFormData('payment', newValue);
  },
  { deep: true }
);

// Methods
const isCreditCardProvider = (providerId: string): boolean => {
  const creditCardProviders = ['stripe', 'credit_card', 'card', 'pp_fake-cc_dev-fake-cc'];
  const isCreditCard = creditCardProviders.includes(providerId);
  console.log('isCreditCardProvider check:', { providerId, isCreditCard, creditCardProviders });
  return isCreditCard;
};

const onProviderChange = () => {
  console.log('Provider changed to:', selectedProviderId.value);
  emit('providerSelected', selectedProviderId.value);
  
  // Reset payment data when provider changes
  const baseData = {
    provider: selectedProviderId.value,
    method: selectedProviderId.value,
    data: {},
  };
  
  // Set default data based on provider type
  if (selectedProviderId.value === 'cash_on_delivery') {
    localPaymentData.value = {
      ...baseData,
      codOption: 'cash',
    };
  } else if (selectedProviderId.value === 'pp_system_default') {
    localPaymentData.value = {
      ...baseData,
      // No additional fields needed for system default
    };
  } else {
    localPaymentData.value = baseData;
  }
  
  console.log('Payment data reset to:', localPaymentData.value);
  
  errors.value = {};
  touchedFields.value.clear();
};

const validateField = (fieldName: string) => {
  touchedFields.value.add(fieldName);
  
  switch (fieldName) {
    case 'cardNumber':
      if (!localPaymentData.value.cardNumber) {
        errors.value.cardNumber = 'Kart numarası zorunludur';
      } else if (!checkoutHelper.validateCardNumber(localPaymentData.value.cardNumber)) {
        errors.value.cardNumber = 'Geçerli bir kart numarası giriniz';
      } else {
        delete errors.value.cardNumber;
      }
      break;
      
    case 'expiryDate':
      if (!localPaymentData.value.expiryDate) {
        errors.value.expiryDate = 'Son kullanma tarihi zorunludur';
      } else if (!checkoutHelper.validateExpiryDate(localPaymentData.value.expiryDate)) {
        errors.value.expiryDate = 'Geçerli bir tarih giriniz (MM/YY)';
      } else {
        delete errors.value.expiryDate;
      }
      break;
      
    case 'cvv':
      if (!localPaymentData.value.cvv) {
        errors.value.cvv = 'CVV kodu zorunludur';
      } else if (!checkoutHelper.validateCVV(localPaymentData.value.cvv)) {
        errors.value.cvv = 'Geçerli bir CVV kodu giriniz';
      } else {
        delete errors.value.cvv;
      }
      break;
      
    case 'cardName':
      if (!localPaymentData.value.cardName) {
        errors.value.cardName = 'Kart üzerindeki isim zorunludur';
      } else {
        delete errors.value.cardName;
      }
      break;
  }
};

const validateAllFields = () => {
  if (isCreditCardProvider(selectedProviderId.value)) {
    const fields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
    fields.forEach(field => validateField(field));
  }
};

const getFieldClasses = (fieldName: string) => {
  if (!touchedFields.value.has(fieldName)) {
    return 'border-gray-300';
  }
  
  return errors.value[fieldName] 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
    : 'border-green-300 focus:border-green-500 focus:ring-green-500';
};

const handleNext = () => {
  console.log('=== HANDLE NEXT CALLED ===');
  console.log('Button clicked, starting submission process...');
  
  // Validate all fields for credit card
  if (isCreditCardProvider(selectedProviderId.value)) {
    console.log('Credit card provider detected, validating fields...');
    validateAllFields();
  }
  
  console.log('Payment Form Debug:', {
    selectedProviderId: selectedProviderId.value,
    localPaymentData: localPaymentData.value,
    errors: errors.value,
    isFormValid: isFormValid.value,
    touchedFields: Array.from(touchedFields.value),
    isCreditCard: isCreditCardProvider(selectedProviderId.value),
    cardNumber: localPaymentData.value.cardNumber,
    expiryDate: localPaymentData.value.expiryDate,
    cvv: localPaymentData.value.cvv,
    cardName: localPaymentData.value.cardName,
  });

  // Always try to submit regardless of form validation
  console.log('EMITTING SUBMIT EVENT...');
  console.log('Emit data:', {
    providerId: selectedProviderId.value,
    paymentData: localPaymentData.value,
  });
  
  try {
    emit('submit', {
      providerId: selectedProviderId.value,
      paymentData: localPaymentData.value,
    });
    console.log('✅ SUBMIT EVENT EMITTED SUCCESSFULLY');
  } catch (error) {
    console.error('❌ ERROR EMITTING SUBMIT EVENT:', error);
  }
  
  // Additional debug - check if form validation was the issue
  if (!isFormValid.value) {
    console.log('⚠️ Form was not valid but we still submitted');
  } else {
    console.log('✅ Form was valid');
  }
};

// Load saved data on mount
onMounted(() => {
  const savedData = checkoutHelper.loadFormData('payment');
  if (savedData) {
    localPaymentData.value = { ...localPaymentData.value, ...savedData };
  }
  
  // Ensure method is set if provider is already selected
  if (selectedProviderId.value && !localPaymentData.value.method) {
    localPaymentData.value.method = selectedProviderId.value;
    localPaymentData.value.provider = selectedProviderId.value;
  }
});
</script>
