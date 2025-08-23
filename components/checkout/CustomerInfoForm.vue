<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">İletişim Bilgileri</h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
          E-posta <span class="text-red-500">*</span>
        </label>
        <input id="email" v-model="localCustomerInfo.email" type="email"
          class="w-full px-3 py-2 border rounded-md focus:ring-black focus:border-black transition-colors"
          :class="getFieldClasses('email')" placeholder="ornek@email.com" required :disabled="isLoading"
          @blur="validateField('email')" />
        <p v-if="errors.email" class="mt-1 text-sm text-red-600">
          {{ errors.email }}
        </p>
      </div>

      <!-- Name Row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
            Ad <span class="text-red-500">*</span>
          </label>
          <input id="firstName" v-model="localCustomerInfo.firstName" type="text"
            class="w-full px-3 py-2 border rounded-md focus:ring-black focus:border-black transition-colors"
            :class="getFieldClasses('firstName')" required :disabled="isLoading" @blur="validateField('firstName')" />
          <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">
            {{ errors.firstName }}
          </p>
        </div>

        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
            Soyad <span class="text-red-500">*</span>
          </label>
          <input id="lastName" v-model="localCustomerInfo.lastName" type="text"
            class="w-full px-3 py-2 border rounded-md focus:ring-black focus:border-black transition-colors"
            :class="getFieldClasses('lastName')" required :disabled="isLoading" @blur="validateField('lastName')" />
          <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">
            {{ errors.lastName }}
          </p>
        </div>
      </div>

      <!-- Phone -->
      <div>
        <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
          Telefon
        </label>
        <input id="phone" v-model="localCustomerInfo.phone" type="tel"
          class="w-full px-3 py-2 border rounded-md focus:ring-black focus:border-black transition-colors"
          :class="getFieldClasses('phone')" placeholder="+90 5XX XXX XX XX" :disabled="isLoading"
          @blur="validateField('phone')" />
        <p v-if="errors.phone" class="mt-1 text-sm text-red-600">
          {{ errors.phone }}
        </p>
      </div>

      <!-- Buttons -->
      <div class="flex justify-end pt-4">
        <button type="submit" :disabled="!isFormValid || isLoading"
          class="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isLoading ? 'Devam Ediliyor...' : 'Teslimat Adresine Geç' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { checkoutHelper } from '~/utils/checkoutHelpers';

interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface Props {
  customerInfo: CustomerInfo;
  isLoading?: boolean;
}

interface Emits {
  (e: 'update:customerInfo', value: CustomerInfo): void;
  (e: 'submit', value: CustomerInfo): void;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
});

const emit = defineEmits<Emits>();

// Local state
const localCustomerInfo = ref<CustomerInfo>({ ...props.customerInfo });


const errors = ref<Record<string, string>>({});
const touchedFields = ref<Set<string>>(new Set());
const isInitialized = ref<boolean>(false);

// Computed
const isFormValid = computed(() => {
  const validation = checkoutHelper.validateCustomerInfo(localCustomerInfo.value);
  return validation.isValid;
});

// Watchers - simplified without unnecessary debouncing
let isUpdatingFromProps = false;
let isUpdatingFromSavedData = false;

watch(
  () => props.customerInfo,
  (newValue) => {
    if (isUpdatingFromSavedData) return; // Prevent loop from saved data
    isUpdatingFromProps = true;
    localCustomerInfo.value = { ...newValue };
    nextTick(() => {
      isUpdatingFromProps = false;
    });
  },
  { deep: true }
);

watch(
  localCustomerInfo,
  (newValue) => {
    if (isInitialized.value && !isUpdatingFromProps && !isUpdatingFromSavedData) {
      emit('update:customerInfo', { ...newValue });
      checkoutHelper.saveFormData('customer', newValue);
    }
  },
  { deep: true }
);

// Methods
const validateField = (fieldName: string) => {
  touchedFields.value.add(fieldName);

  // Use nextTick to prevent reactive update cycles
  nextTick(() => {
    const newErrors = { ...errors.value };

    switch (fieldName) {
      case 'email':
        if (!localCustomerInfo.value.email) {
          newErrors.email = 'E-posta adresi zorunludur';
        } else if (!checkoutHelper.validateEmail(localCustomerInfo.value.email)) {
          newErrors.email = 'Geçerli bir e-posta adresi giriniz';
        } else {
          delete newErrors.email;
        }
        break;

      case 'firstName':
        if (!localCustomerInfo.value.firstName) {
          newErrors.firstName = 'Ad alanı zorunludur';
        } else {
          delete newErrors.firstName;
        }
        break;

      case 'lastName':
        if (!localCustomerInfo.value.lastName) {
          newErrors.lastName = 'Soyad alanı zorunludur';
        } else {
          delete newErrors.lastName;
        }
        break;

      case 'phone':
        if (localCustomerInfo.value.phone && !checkoutHelper.validatePhone(localCustomerInfo.value.phone)) {
          newErrors.phone = 'Geçerli bir telefon numarası giriniz';
        } else {
          delete newErrors.phone;
        }
        break;
    }

    errors.value = newErrors;
  });
};

const validateAllFields = () => {
  const fields = ['email', 'firstName', 'lastName', 'phone'];
  // Use nextTick to prevent recursive updates
  nextTick(() => {
    fields.forEach(field => {
      touchedFields.value.add(field);
    });

    const newErrors: Record<string, string> = {};

    // Validate all fields at once
    if (!localCustomerInfo.value.email) {
      newErrors.email = 'E-posta adresi zorunludur';
    } else if (!checkoutHelper.validateEmail(localCustomerInfo.value.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }

    if (!localCustomerInfo.value.firstName) {
      newErrors.firstName = 'Ad alanı zorunludur';
    }

    if (!localCustomerInfo.value.lastName) {
      newErrors.lastName = 'Soyad alanı zorunludur';
    }

    if (localCustomerInfo.value.phone && !checkoutHelper.validatePhone(localCustomerInfo.value.phone)) {
      newErrors.phone = 'Geçerli bir telefon numarası giriniz';
    }

    errors.value = newErrors;
  });
};

const getFieldClasses = (fieldName: string) => {
  if (!touchedFields.value.has(fieldName)) {
    return 'border-gray-300';
  }

  return errors.value[fieldName]
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-green-300 focus:border-green-500 focus:ring-green-500';
};

const handleSubmit = () => {
  validateAllFields();

  if (isFormValid.value) {
    emit('submit', localCustomerInfo.value);
  }
};

// Load saved data on mount
onMounted(() => {
  const savedData = checkoutHelper.loadFormData('customer');
  if (savedData) {
    console.log('Loaded saved customer data:', savedData);
    // Set flag to prevent watcher loops
    isUpdatingFromSavedData = true;
    localCustomerInfo.value = { ...localCustomerInfo.value, ...savedData };
  }

  // Mark as initialized after loading saved data
  nextTick(() => {
    isInitialized.value = true;
    // Reset the flag and emit if there was saved data
    if (savedData) {
      isUpdatingFromSavedData = false;
      emit('update:customerInfo', localCustomerInfo.value);
    } else {
      isUpdatingFromSavedData = false;
    }
  });
});

// Cleanup on unmount
onUnmounted(() => {
  // Component cleanup is handled by Vue automatically
});
</script>
