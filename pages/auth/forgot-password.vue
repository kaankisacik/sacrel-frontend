<template>
  <div class="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Şifremi Unuttum
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div v-if="!emailSent">
          <form class="space-y-6" @submit.prevent="handleForgotPassword">
            <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {{ error }}
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                E-posta adresi
              </label>
              <div class="mt-1">
                <input
                  id="email"
                  v-model="form.email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="ornek@email.com"
                >
              </div>
            </div>

            <div>
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isLoading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Gönderiliyor...
                </span>
                <span v-else>Şifre Sıfırlama Bağlantısı Gönder</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Success Message -->
        <div v-else class="text-center">
          <div class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded mb-6">
            <div class="flex items-center">
              <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <span>Şifre sıfırlama bağlantısı e-posta adresinize gönderildi!</span>
            </div>
          </div>
          <p class="text-sm text-gray-600 mb-6">
            E-posta kutunuzu kontrol edin ve bağlantıya tıklayarak şifrenizi sıfırlayın.
            E-posta gelmediyse spam klasörünüzü de kontrol etmeyi unutmayın.
          </p>
        </div>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">veya</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <NuxtLink
              to="/auth/login"
              class="text-center inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Giriş Yap
            </NuxtLink>
            <NuxtLink
              to="/auth/register"
              class="text-center inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Kayıt Ol
            </NuxtLink>
          </div>

          <div class="mt-6 text-center">
            <NuxtLink
              to="/"
              class="text-sm text-gray-600 hover:text-gray-500"
            >
              Ana sayfaya dön
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/authStore'


const authStore = useAuthStore()

const form = reactive({
  email: ''
})

const isLoading = computed(() => authStore.isLoading)
const error = computed(() => authStore.error)
const emailSent = ref(false)

const handleForgotPassword = async () => {
  authStore.clearError()

  const result = await authStore.forgotPassword(form.email)
  
  if (result.success) {
    emailSent.value = true
  }
}

// Clear error when email changes
watch(() => form.email, () => {
  if (error.value) {
    authStore.clearError()
  }
})
</script>
