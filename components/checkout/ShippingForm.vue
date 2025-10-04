<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex items-start justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-900">Teslimat Adresi</h2>
      <div v-if="savedAddresses.length > 0" class="flex items-center space-x-2">
        <span class="text-sm text-gray-600">Düzenle</span>
        <button type="button" @click="toggleAddressMode"
          class="relative inline-flex h-5 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          :class="isAddingNewAddress ? 'bg-black' : 'bg-gray-200'">
          <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
            :class="isAddingNewAddress ? 'translate-x-6' : 'translate-x-1'" />
        </button>
      </div>
    </div>

    <!-- Saved Addresses Selection -->
    <div v-if="savedAddresses.length > 0 && !isAddingNewAddress" class="mb-6">
      <label for="addressSelect" class="block text-sm font-medium text-gray-700 mb-2">
        Kayıtlı Adresleriniz
      </label>
      <div class="space-y-3">
        <label v-for="address in savedAddresses" :key="address.id"
          class="flex items-start p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          :class="{ 'border-black bg-gray-50': selectedAddressId === address.id }">
          <input v-model="selectedAddressId" type="radio" :value="address.id" class="mt-1 text-black focus:ring-black"
            @change="onAddressSelection" />
          <div class="ml-3 flex-1">
            <div class="text-sm font-medium text-gray-900">
              {{ address.first_name }} {{ address.last_name }}
            </div>
            <div class="text-sm text-gray-600 mt-1">
              {{ checkoutHelper.formatAddress(address) }}
            </div>
            <div v-if="address.phone" class="text-sm text-gray-500 mt-1">
              {{ address.phone }}
            </div>
          </div>
        </label>
      </div>
    </div>

    <!-- Address Form -->
    <div v-if="savedAddresses.length === 0 || isAddingNewAddress">
      <form @submit.prevent="handleNext" class="space-y-4">
        <!-- Address Line -->
        <div>
          <label for="address" class="block text-sm font-medium text-gray-700 mb-1">
            Adres <span class="text-red-500">*</span>
          </label>
          <textarea id="address" v-model="localShippingAddress.address_1"
            class="w-full px-3 py-2 border rounded-md focus:ring-black focus:border-black transition-colors resize-none"
            :class="getFieldClasses('address_1')" rows="3" placeholder="Mahalle, sokak, apartman, daire no" required
            :disabled="isLoading" @blur="validateField('address_1')" />
          <p v-if="errors.address_1" class="mt-1 text-sm text-red-600">
            {{ errors.address_1 }}
          </p>
        </div>

        <!-- City and District -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label for="city" class="block text-sm font-medium text-gray-700 mb-1">
              İl <span class="text-red-500">*</span>
            </label>
            <input id="city" v-model="localShippingAddress.city" type="text"
              class="w-full px-3 py-2 border rounded-md focus:ring-black focus:border-black transition-colors"
              :class="getFieldClasses('city')" required :disabled="isLoading" @blur="validateField('city')" />
            <p v-if="errors.city" class="mt-1 text-sm text-red-600">
              {{ errors.city }}
            </p>
          </div>

          <div>
            <label for="district" class="block text-sm font-medium text-gray-700 mb-1">
              İlçe <span class="text-red-500">*</span>
            </label>
            <input id="district" v-model="localShippingAddress.district" type="text"
              class="w-full px-3 py-2 border rounded-md focus:ring-black focus:border-black transition-colors"
              :class="getFieldClasses('district')" required :disabled="isLoading" @blur="validateField('district')" />
            <p v-if="errors.district" class="mt-1 text-sm text-red-600">
              {{ errors.district }}
            </p>
          </div>

          <div>
            <label for="postalCode" class="block text-sm font-medium text-gray-700 mb-1">
              Posta Kodu <span class="text-red-500">*</span>
            </label>
            <input id="postalCode" v-model="localShippingAddress.postalCode" type="text" maxlength="5"
              class="w-full px-3 py-2 border rounded-md focus:ring-black focus:border-black transition-colors"
              :class="getFieldClasses('postalCode')" placeholder="34000" required :disabled="isLoading"
              @blur="validateField('postalCode')" />
            <p v-if="errors.postalCode" class="mt-1 text-sm text-red-600">
              {{ errors.postalCode }}
            </p>
          </div>
        </div>

        <!-- Postal Code and Phone -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          

          <!-- <div >
            <label for="addressPhone" class="block text-sm font-medium text-gray-700 mb-1">
              Telefon
            </label>
            <input id="addressPhone" v-model="localShippingAddress.phone" type="tel"
              class="w-full px-3 py-2 border rounded-md focus:ring-black focus:border-black transition-colors"
              :class="getFieldClasses('phone')" placeholder="5XX XXX XX XX" :disabled="isLoading"
              @blur="validateField('phone')" />
            <p v-if="errors.phone" class="mt-1 text-sm text-red-600">
              {{ errors.phone }}
            </p>
          </div> -->
        </div>
      </form>
    </div>

    <!-- Address Confirmation Button -->
    <div v-if="showConfirmButton" class="mt-6 border-t pt-6">
      <button type="button" @click="confirmAddress" 
        class="w-full bg-sacrel-accent/80 text-white px-4 py-3 rounded-md hover:bg-sacrel-accent transition duration-300 font-medium">
        Adresi Onayla
      </button>
    </div>

    <!-- Shipping Options -->
    <div v-if="showShippingOptions && shippingOptions.length > 0 && (addressConfirmed || (!isAddingNewAddress && selectedAddressId))" class="mt-6 border-t pt-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Kargo Seçenekleri</h3>
      <div class="space-y-3">
        <label v-for="option in shippingOptions" :key="option.id"
          class="flex items-center justify-between p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          :class="{ 'border-black bg-gray-50': selectedShippingOptionId === option.id }">
          <div class="flex items-center">
            <input v-model="selectedShippingOptionId" type="radio" :value="option.id"
              class="text-black focus:ring-black" @change="onShippingOptionChange" />
            <div class="ml-3">
              <div class="text-sm font-medium text-gray-900">
                {{ checkoutHelper.getShippingMethodName(option) }}
              </div>
              <div v-if="checkoutHelper.getShippingMethodDescription(option)" class="text-sm text-gray-600">
                {{ checkoutHelper.getShippingMethodDescription(option) }}
              </div>
            </div>
          </div>
          <div class="text-sm font-medium text-gray-900">
            {{ checkoutHelper.getShippingMethodPrice(option) }}
          </div>
        </label>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex justify-between pt-6 border-t mt-6">
      <button type="button" @click="$emit('previous')"
        class="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition duration-300">
        Geri
      </button>

      <button type="button" @click="handleNext" :disabled="!isFormValid || isLoading"
        class="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
        {{ isLoading ? 'Yükleniyor...' : 'Ödeme Yöntemine Geç' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { checkoutHelper } from '~/utils/checkoutHelpers';

interface ShippingAddress {
  address_1: string;
  city: string;
  district: string;
  postalCode: string;
  countryCode: string;
  phone?: string;
}

interface SavedAddress {
  id: string;
  first_name: string;
  last_name: string;
  address_1: string;
  city: string;
  province: string;
  postal_code: string;
  phone?: string;
}

interface ShippingOption {
  id: string;
  name: string;
  price?: number;
  amount?: number;
  estimated_delivery_days?: number;
  description?: string;
}

interface Props {
  shippingAddress: ShippingAddress;
  savedAddresses?: SavedAddress[];
  shippingOptions?: any[];
  selectedShippingOptionId?: string;
  customerPhone?: string;
  isLoading?: boolean;
  showShippingOptions?: boolean;
}

interface Emits {
  (e: 'update:shippingAddress', value: ShippingAddress): void;
  (e: 'update:selectedShippingOptionId', value: string): void;
  (e: 'submit', data: { address: ShippingAddress; shippingOptionId: string }): void;
  (e: 'previous'): void;
  (e: 'addressSelected', addressId: string): void;
  (e: 'shippingOptionSelected', optionId: string): void;
  (e: 'loadShippingOptions'): void;
  (e: 'resetUserSelection'): void;
}

const props = withDefaults(defineProps<Props>(), {
  savedAddresses: () => [],
  shippingOptions: () => [],
  selectedShippingOptionId: '',
  customerPhone: '',
  isLoading: false,
  showShippingOptions: true,
});

const emit = defineEmits<Emits>();

// Local state
const localShippingAddress = ref<ShippingAddress>({ 
  ...props.shippingAddress,
  // Use customer phone if no phone is set in shipping address
  phone: props.shippingAddress.phone || props.customerPhone || ''
});
const selectedAddressId = ref<string>('');
const selectedShippingOptionId = ref<string>(props.selectedShippingOptionId);
const isAddingNewAddress = ref<boolean>(props.savedAddresses.length === 0);
const errors = ref<Record<string, string>>({});
const touchedFields = ref<Set<string>>(new Set());

// Computed
const isFormValid = computed(() => {
  // If using saved address, only check if address is selected and shipping option is selected
  if (!isAddingNewAddress.value && selectedAddressId.value) {
    const isValid = props.showShippingOptions ? selectedShippingOptionId.value !== '' : true;
    console.log('Saved address form valid:', isValid, {
      showShippingOptions: props.showShippingOptions,
      selectedShippingOptionId: selectedShippingOptionId.value,
      selectedAddressId: selectedAddressId.value
    });
    return isValid;
  }

  // For manual address entry
  const validation = checkoutHelper.validateShippingAddress(localShippingAddress.value);
  const hasValidAddress = validation.isValid;
  const hasConfirmedAddress = addressConfirmed.value;
  const hasShippingOption = !props.showShippingOptions || selectedShippingOptionId.value !== '';
  
  const isValid = hasValidAddress && hasConfirmedAddress && hasShippingOption;
  console.log('Manual address form valid:', isValid, {
    hasValidAddress,
    hasConfirmedAddress, 
    hasShippingOption,
    selectedShippingOptionId: selectedShippingOptionId.value
  });
  return isValid;
});

// Watchers - optimized but functional
let isUpdatingFromProps = false;

// Sync props to local state
watch(
  () => props.shippingAddress,
  (newValue) => {
    isUpdatingFromProps = true;
    localShippingAddress.value = { 
      ...newValue,
      // Preserve customer phone if no phone in shipping address
      phone: newValue.phone || props.customerPhone || ''
    };
    nextTick(() => {
      isUpdatingFromProps = false;
    });
  },
  { deep: true }
);

// Watch for customer phone changes
watch(
  () => props.customerPhone,
  (newPhone) => {
    // Update phone only if current phone is empty or was previously customer phone
    if (!localShippingAddress.value.phone || localShippingAddress.value.phone === props.customerPhone) {
      localShippingAddress.value.phone = newPhone || '';
    }
  }
);

// Emit local changes back to parent (only when not updating from props)
watch(
  localShippingAddress,
  (newValue) => {
    if (!isUpdatingFromProps) {
      emit('update:shippingAddress', newValue);
      checkoutHelper.saveFormData('shipping', newValue);
    }
  },
  { deep: true }
);

// Simple shipping option sync
watch(
  selectedShippingOptionId,
  (newValue) => {
    emit('update:selectedShippingOptionId', newValue);
  }
);

// State for address confirmation
const addressConfirmed = ref(false);
const showConfirmButton = computed(() => {
  // Show confirm button only for manual address entry when form is valid but not yet confirmed
  if (!isAddingNewAddress.value) return false;
  
  const validation = checkoutHelper.validateShippingAddress(localShippingAddress.value);
  return validation.isValid && !addressConfirmed.value;
});

// Method to confirm address and load shipping options
const confirmAddress = () => {
  const validation = checkoutHelper.validateShippingAddress(localShippingAddress.value);
  if (validation.isValid) {
    // Clear any previous shipping option selection
    selectedShippingOptionId.value = '';
    addressConfirmed.value = true;
    // Reset user selection flag
    emit('resetUserSelection');
    emit('loadShippingOptions');
  }
};


// Methods
const toggleAddressMode = () => {
  isAddingNewAddress.value = !isAddingNewAddress.value;
  
  // Clear shipping option selection when switching modes
  selectedShippingOptionId.value = '';
  
  // Emit the change to parent component to reset the selected shipping option
  emit('update:selectedShippingOptionId', '');
  emit('shippingOptionSelected', '');
  emit('resetUserSelection'); // Reset the user selection flag
  
  if (!isAddingNewAddress.value) {
    // User switched back to saved addresses - clear selection and reset form
    selectedAddressId.value = '';
    addressConfirmed.value = false;
  } else {
    // Reset confirmation state when switching to new address mode
    addressConfirmed.value = false;
  }
  resetForm();
};

const resetForm = () => {
  // Reset form data to initial props values
  localShippingAddress.value = {
    address_1: '',
    city: '',
    district: '',
    postalCode: '',
    countryCode: '',
    phone: props.customerPhone || '', // Use customer phone if available
  };

  // Clear all errors and touched fields
  errors.value = {};
  touchedFields.value.clear();

  // Reset address confirmation state
  addressConfirmed.value = false;

  // Clear shipping option selection completely
  selectedShippingOptionId.value = '';
  
  // Emit the reset to parent component
  emit('update:selectedShippingOptionId', '');
};

const onAddressSelection = () => {
  if (selectedAddressId.value) {
    // Clear previous shipping option selection when switching addresses
    selectedShippingOptionId.value = '';
    // Set address as confirmed since it's a saved address
    addressConfirmed.value = true;
    // Reset user selection flag
    emit('resetUserSelection');
    // Emit the address selection event
    emit('addressSelected', selectedAddressId.value);
  }
};

const onShippingOptionChange = () => {
  console.log('Selected shipping option:', selectedShippingOptionId.value);

  emit('shippingOptionSelected', selectedShippingOptionId.value);
};

const validateField = (fieldName: string) => {
  touchedFields.value.add(fieldName);

  switch (fieldName) {
    case 'address_1':
      if (!localShippingAddress.value.address_1) {
        errors.value.address_1 = 'Adres alanı zorunludur';
      } else {
        delete errors.value.address_1;
      }
      break;

    case 'city':
      if (!localShippingAddress.value.city) {
        errors.value.city = 'İl alanı zorunludur';
      } else {
        delete errors.value.city;
      }
      break;

    case 'district':
      if (!localShippingAddress.value.district) {
        errors.value.district = 'İlçe alanı zorunludur';
      } else {
        delete errors.value.district;
      }
      break;

    case 'postalCode':
      if (!localShippingAddress.value.postalCode) {
        errors.value.postalCode = 'Posta kodu alanı zorunludur';
      } else if (!checkoutHelper.validatePostalCode(localShippingAddress.value.postalCode)) {
        errors.value.postalCode = 'Geçerli bir posta kodu giriniz (5 haneli)';
      } else {
        delete errors.value.postalCode;
      }
      break;

    case 'phone':
      if (localShippingAddress.value.phone && !checkoutHelper.validatePhone(localShippingAddress.value.phone)) {
        errors.value.phone = 'Geçerli bir telefon numarası giriniz';
      } else {
        delete errors.value.phone;
      }
      break;
  }
};

const validateAllFields = () => {
  if (isAddingNewAddress.value) {
    const fields = ['address_1', 'city', 'district', 'postalCode', 'phone'];
    fields.forEach(field => validateField(field));
    // User needs to manually confirm address to load shipping options
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
  // Prevent multiple rapid submissions
  if (props.isLoading) return;

  validateAllFields();

  if (isFormValid.value) {
    console.log("girdi222");
    console.log("localshippingadress:",localShippingAddress.value);
    
    emit('submit', {
      address: localShippingAddress.value,
      shippingOptionId: selectedShippingOptionId.value,
    });
  }
};

// Load saved data on mount
onMounted(() => {
  const savedData = checkoutHelper.loadFormData('shipping');
  if (savedData) {
    localShippingAddress.value = { ...localShippingAddress.value, ...savedData };
  }
  
  // Set customer phone if available and no phone is set yet
  if (props.customerPhone && !localShippingAddress.value.phone) {
    localShippingAddress.value.phone = props.customerPhone;
  }
});

// Cleanup on unmount
onUnmounted(() => {
  // Component cleanup is handled by Vue automatically
});
</script>
