<template>
  <div class="  flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Hesabınıza giriş yapın
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Hesabınız yok mu?
        <NuxtLink to="/auth/register" class="font-medium text-indigo-600 hover:text-indigo-500">
          Kayıt olun
        </NuxtLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {{ error }}
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              E-posta adresi
            </label>
            <div class="mt-1">
              <input id="email" v-model="form.email" name="email" type="email" autocomplete="email" required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="ornek@email.com">
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Şifre
            </label>
            <div class="mt-1">
              <input id="password" v-model="form.password" name="password" type="password"
                autocomplete="current-password" required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Şifrenizi girin">
            </div>
          </div>

          <!-- <div class="flex items-center justify-between">
            <div class="flex items-center">
              Remember Me
              <input id="remember-me" v-model="form.rememberMe" name="remember-me" type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Beni hatırla
              </label>
            </div>

            <div class="text-sm">
              <NuxtLink to="/auth/forgot-password" class="font-medium text-indigo-600 hover:text-indigo-500">
                Şifremi unuttum
              </NuxtLink>
            </div>
          </div> -->

          <div>
            <button type="submit" :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Giriş yapılıyor...
              </span>
              <span v-else>Giriş yap</span>
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">veya</span>
            </div>
          </div>

          <div class="mt-6 text-center">
            <NuxtLink to="/" class="text-sm text-gray-600 hover:text-gray-500">
              Ana sayfaya dön
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()
const authStore = useAuthStore();
const error = ref(null);

const form = ref({
  email: '',
  password: '',
  rememberMe: false
});

const isLoading = ref(false);

const handleLogin = async () => {
  try {
    isLoading.value = true;
    await authStore.login(form.value.email, form.value.password);
    isLoading.value = false;

    if (authStore.isUserAuthenticated) {
      error.value = null;
      router.push('/');
    } else {
      error.value = 'Giriş başarısız';
    }
  } catch (error) {
    console.error('Login error:', error);
    error.value = 'Giriş sırasında bir hata oluştu';
    return;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>