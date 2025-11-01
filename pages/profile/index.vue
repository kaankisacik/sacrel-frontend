<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="max-w-3xl mx-auto">
            <!-- Page Header -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900">Profil</h1>
                <p class="mt-2 text-gray-600">Hesap bilgilerinizi ve tercihlerinizi yönetin</p>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading || !customer" class="text-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p class="mt-4 text-gray-600">Profil bilgileri yükleniyor...</p>
            </div>

            <!-- Profile Content -->
            <div v-else-if="customer" class="space-y-8">
                <!-- Profile Info Section -->
                <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <div>
                            <h3 class="text-lg leading-6 font-medium text-gray-900">Kişisel Bilgiler</h3>
                            <p class="mt-1 max-w-2xl text-sm text-gray-500">Temel profil bilgileriniz</p>
                        </div>
                        <button @click="showEditProfile = !showEditProfile"
                            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500">
                            <Icon name="heroicons:pencil" class="h-4 w-4 mr-2" />
                            Düzenle
                        </button>
                    </div>

                    <div v-if="!showEditProfile" class="border-t border-gray-200">
                        <dl>
                            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">Ad Soyad</dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ fullName }}</dd>
                            </div>
                            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">E-posta</dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ customer.email }}</dd>
                            </div>
                            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">Telefon</dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ customer.phone ||
                                    'Belirtilmemiş' }}
                                </dd>
                            </div>
                            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">Üyelik Tarihi</dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{
                                    utils.getOnlyDateFromString(customer.created_at) }}</dd>
                            </div>
                        </dl>
                    </div>

                    <!-- Edit Profile Form -->
                    <div v-else class="border-t border-gray-200 p-6">
                        <form @submit.prevent="updateProfile" class="space-y-4">
                            <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                                {{ error }}
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label for="first_name" class="block text-sm font-medium text-gray-700">Ad</label>
                                    <input id="first_name" v-model="profileForm.first_name" type="text"
                                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                </div>
                                <div>
                                    <label for="last_name" class="block text-sm font-medium text-gray-700">Soyad</label>
                                    <input id="last_name" v-model="profileForm.last_name" type="text"
                                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                </div>
                            </div>

                            <div>
                                <label for="phone" class="block text-sm font-medium text-gray-700">Telefon</label>
                                <input id="phone" v-model="profileForm.phone" type="tel"
                                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            </div>

                            <div class="flex justify-end space-x-3">
                                <button type="button" @click="cancelEdit"
                                    class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    İptal
                                </button>
                                <button type="submit" :disabled="isLoading"
                                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                                    Kaydet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Addresses Section -->
                <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <div>
                            <h3 class="text-lg leading-6 font-medium text-gray-900">Adreslerim</h3>
                            <p class="mt-1 max-w-2xl text-sm text-gray-500">Kayıtlı teslimat adresleriniz</p>
                        </div>
                        <button @click="showAddAddress = true"
                            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-neutral-600 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <Icon name="heroicons:plus" class="h-4 w-4 mr-2" />
                            Yeni Adres
                        </button>
                    </div>

                    <div class="border-t border-gray-200">
                        <div v-if="addresses.length === 0" class="p-6 text-center text-gray-500">
                            Henüz kayıtlı adresiniz bulunmuyor.
                        </div>

                        <div v-else class="divide-y divide-gray-200">
                            <div v-for="address in addresses" :key="address.id" class="p-6">
                                <div class="flex justify-between w-full items-start">
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-gray-900 truncate">
                                            {{ address.first_name }} {{ address.last_name }}
                                        </p>
                                        <p class="text-sm text-gray-600 w-full truncate">{{ address.address_1 }}</p>
                                        <p v-if="address.address_2" class="text-sm text-gray-600 w-full truncate">{{
                                            address.address_2 }}
                                        </p>
                                        <p class="text-sm text-gray-600 w-full truncate">
                                            {{ address.city }}, {{ address.metadata?.district }}, {{ address.postal_code
                                            }}
                                        </p>
                                        <p v-if="address.phone" class="text-sm text-gray-600 truncate">{{ address.phone
                                            }}</p>
                                    </div>
                                    <div class="flex flex-shrink-0 space-x-2 ml-4">
                                        <button @click="editAddress(address)"
                                            class="text-neutral-600 hover:text-neutral-500 text-sm">
                                            Düzenle
                                        </button>
                                        <button @click="deleteAddressConfirm(address.id)"
                                            class="text-red-600 hover:text-red-500 text-sm">
                                            Sil
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Orders Section -->
                <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <div>
                            <h3 class="text-lg leading-6 font-medium text-gray-900">Siparişlerim</h3>
                            <p class="mt-1 max-w-2xl text-sm text-gray-500">Geçmiş siparişlerinizi görüntüleyin.</p>
                        </div>
                        <NuxtLink to="/profile/orders"
                            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-neutral-600 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <Icon name="mdi:truck-cargo-container" class="h-4 w-4 mr-2" />
                            Tüm Siparişler
                        </NuxtLink>
                    </div>
                </div>

                <!-- Account Actions Section -->
                <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div class="px-4 py-5 sm:px-6">
                        <h3 class="text-lg leading-6 font-medium text-gray-900">Hesap İşlemleri</h3>
                        <p class="mt-1 max-w-2xl text-sm text-gray-500">Hesabınızla ilgili işlemler</p>
                    </div>
                    <div class="border-t border-gray-200 px-4 py-4 space-y-3">
                        <button @click="handlePasswordReset"
                            :disabled="isLoading"
                            class="w-full inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                            <Icon name="heroicons:key" class="h-4 w-4 mr-2" />
                            Şifre Değiştirme Linki Gönder
                        </button>
                        <button @click="handleLogout"
                            class="w-full inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                            <Icon name="heroicons:arrow-right-on-rectangle" class="h-4 w-4 mr-2" />
                            Çıkış Yap
                        </button>
                    </div>
                </div>
            </div>

            <!-- Not authenticated state -->
            <div v-else class="text-center py-12">
                <Icon name="heroicons:user-circle" class="h-24 w-24 text-gray-300 mx-auto mb-4" />
                <h2 class="text-xl font-medium text-gray-900 mb-2">Giriş yapmanız gerekiyor</h2>
                <p class="text-gray-600 mb-6">Profil bilgilerinizi görüntülemek için lütfen giriş yapın.</p>
                <div class="space-x-4">
                    <NuxtLink to="/login"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                        Giriş Yap
                    </NuxtLink>
                    <NuxtLink to="/register"
                        class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Kayıt Ol
                    </NuxtLink>
                </div>
            </div>
        </div>

        <!-- Add/Edit Address Modal -->
        <div v-if="showAddAddress || editingAddress"
            class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div class="mt-3">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">
                        {{ editingAddress ? 'Adresi Düzenle' : 'Yeni Adres Ekle' }}
                    </h3>

                    <form @submit.prevent="updateAddress" class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Ad</label>
                                <input v-model="addressForm.first_name" type="text" required
                                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Soyad</label>
                                <input v-model="addressForm.last_name" type="text" required
                                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Adres</label>
                            <input v-model="addressForm.address_1" type="text" required
                                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        </div>

                        <!-- <div>
              <label class="block text-sm font-medium text-gray-700">Adres 2 (Opsiyonel)</label>
              <input
                v-model="addressForm.address_2"
                type="text"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
            </div> -->

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">İl</label>
                                <input v-model="addressForm.city" type="text" required
                                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">İlçe</label>
                                <input v-model="district" type="text" required
                                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Posta Kodu</label>
                                <input v-model="addressForm.postal_code" type="text" required
                                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Ülke Kodu</label>
                                <input v-model="addressForm.country_code" type="text" required
                                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Telefon</label>
                            <input v-model="addressForm.phone" type="tel"
                                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        </div>

                        <div class="flex justify-end space-x-3 pt-4">
                            <button type="button" @click="closeAddressModal"
                                class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                İptal
                            </button>
                            <button type="submit" :disabled="isLoading"
                                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-neutral-600 hover:bg-neutral-700 disabled:opacity-50">
                                Kaydet
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { utils } from "@/utils/utils";
import type { StoreCustomerAddress, StoreUpdateCustomerAddress, StoreCreateCustomerAddress } from "@medusajs/types";

const customerStore = useCustomerStore()
const authStore = useAuthStore()
const { currentCustomer, currentCustomerAddresses } = storeToRefs(customerStore)
// Reactive state
const showEditProfile = ref(false)
const showAddAddress = ref(false)
const editingAddress = ref<StoreCustomerAddress | null>(null)
// Profile form
const profileForm = reactive({
    first_name: '',
    last_name: '',
    phone: ''
})

// Address form
const addressForm = reactive({
    first_name: '',
    last_name: '',
    address_1: '',
    address_2: '',
    city: '',
    province: '',
    postal_code: '',
    country_code: 'TR',
    phone: '',
    metadata: {} as Record<string, any>
} as StoreCreateCustomerAddress)
const district = ref('')



// Computed properties
const customer = computed<any>(() => currentCustomer.value?.customer)
const addresses = computed<any[]>(() => currentCustomerAddresses.value?.addresses || [])
const isLoading = computed<boolean>(() => false)
const error = ref<string | null>(null)
const fullName = computed<string>(() => {
    return `${customer.value?.first_name || ''} ${customer.value?.last_name || ''}`.trim()
})

// Initialize profile form when customer data is available
watch(customer, (newCustomer: any) => {
    if (newCustomer) {
        profileForm.first_name = newCustomer.first_name || ''
        profileForm.last_name = newCustomer.last_name || ''
        profileForm.phone = newCustomer.phone || ''
    }
}, { immediate: true })


const updateProfile = async () => {
    console.log("Updating profile with form data:", profileForm);

    try {
        await customerStore.updateCustomer(profileForm)
    } catch (error) {
        console.error("Failed to update profile:", error)
    } finally {
        showEditProfile.value = false
    }


}



const cancelEdit = () => {
    // Reset form to original values
    if (customer.value) {
        var a = (customer.value) as any
        profileForm.first_name = a.first_name || ''
        profileForm.last_name = a.last_name || ''
        profileForm.phone = a.phone || ''
    }
    showEditProfile.value = false
}

const editAddress = (address: StoreCustomerAddress) => {
    editingAddress.value = address
    Object.assign(addressForm, address)
    showAddAddress.value = true
    district.value = address.metadata?.district as string || ''
}



const updateAddress = async () => {
    console.log("Updating address with form data:", addressForm, "District:", district.value);

    if (addressForm.metadata) {
        addressForm.metadata.district = district.value
    } else {
        addressForm.metadata = { district: district.value }
    }
    var filteredAddressForm = utils.filterObjectKeys(utils.removeKeysByConditions(addressForm, ['id', "customer_id", "created_at", "updated_at", "deleted_at"]));
    if (editingAddress.value) {
        await customerStore.updateCustomerAddresses(editingAddress.value.id, filteredAddressForm)
    } else {
        await customerStore.addAddress(filteredAddressForm)
    }


    closeAddressModal()

}

const deleteAddressConfirm = async (addressId: any) => {
    if (confirm('Bu adresi silmek istediğinizden emin misiniz?')) {
        await customerStore.removeCustomerAddress(addressId)
    }
}

const closeAddressModal = () => {
    showAddAddress.value = false
    editingAddress.value = null
    Object.assign(addressForm, {
        first_name: '',
        last_name: '',
        address_1: '',
        address_2: '',
        city: '',
        province: '',
        postal_code: '',
        country_code: 'TR',
        phone: ''
    })

    district.value = ''
}

const handlePasswordReset = async () => {
    if (!customer.value?.email) {
        alert('E-posta adresi bulunamadı.');
        return;
    }

    if (confirm('Şifre değiştirme bağlantısı e-posta adresinize gönderilsin mi?')) {
        try {
            console.log("email:",customer.value.email);
            
            const result = await authStore.forgotPassword(customer.value.email);
            if (result.success) {
                alert('Şifre değiştirme bağlantısı e-posta adresinize gönderildi. E-posta kutunuzu kontrol edin.');
            } else {
                alert('Şifre değiştirme bağlantısı gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
            }
        } catch (error) {
            console.error('Şifre değiştirme hatası:', error);
            alert('Şifre değiştirme bağlantısı gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
        }
    }
}

const handleLogout = async () => {
    if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
        try {
            await authStore.logout();
            navigateTo('/');
        } catch (error) {
            console.error('Çıkış yapılırken hata oluştu:', error);
        }
    }
}




onMounted(async () => {
    try {
        await customerStore.getCustomer()
    } catch (error) {
        console.error('Profil yüklenirken hata oluştu:', error)
    }
})
</script>