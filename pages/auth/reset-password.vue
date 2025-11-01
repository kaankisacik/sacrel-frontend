<template>
  <div class="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Şifre Sıfırla
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        <span v-if="userEmail">{{ userEmail }} için </span>yeni şifrenizi
        belirleyin
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div v-if="!passwordReset">
          <!-- Invalid token warning -->
          <div
            v-if="!isValidTokenFormat"
            class="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <svg
                  class="h-5 w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span>Geçersiz şifre sıfırlama bağlantısı.</span>
              </div>
              <NuxtLink
                to="/auth/forgot-password"
                class="text-sm underline hover:no-underline"
              >
                Yeni bağlantı iste
              </NuxtLink>
            </div>
          </div>

          <form class="space-y-6" @submit.prevent="handleResetPassword">
            <div
              v-if="error"
              class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded"
            >
              {{ error }}
            </div>

            <div>
              <label
                for="password"
                class="block text-sm font-medium text-gray-700"
              >
                Yeni Şifre
              </label>
              <div class="mt-1">
                <input
                  id="password"
                  v-model="form.password"
                  name="password"
                  type="password"
                  autocomplete="new-password"
                  required
                  minlength="8"
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="En az 8 karakter"
                />
              </div>
            </div>

            <div>
              <label
                for="confirmPassword"
                class="block text-sm font-medium text-gray-700"
              >
                Yeni Şifre (Tekrar)
              </label>
              <div class="mt-1">
                <input
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autocomplete="new-password"
                  required
                  minlength="8"
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Şifrenizi tekrar girin"
                />
              </div>
              <div
                v-if="
                  form.password &&
                  form.confirmPassword &&
                  form.password !== form.confirmPassword
                "
                class="mt-1 text-sm text-red-600"
              >
                Şifreler eşleşmiyor
              </div>
            </div>

            <div>
              <button
                type="submit"
                :disabled="isLoading || !isFormValid || !isValidTokenFormat"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isLoading" class="flex items-center">
                  <svg
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Şifre sıfırlanıyor...
                </span>
                <span v-else>Şifreyi Sıfırla</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Success Message -->
        <div v-else class="text-center">
          <div
            class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded mb-6"
          >
            <div class="flex items-center">
              <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span>Şifreniz başarıyla sıfırlandı!</span>
            </div>
          </div>
          <p class="text-sm text-gray-600 mb-6">
            Artık yeni şifrenizle giriş yapabilirsiniz.
          </p>
          <NuxtLink
            to="/auth/login"
            class="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Giriş Yap
          </NuxtLink>
        </div>

        <div v-if="!passwordReset" class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">veya</span>
            </div>
          </div>

          <div class="mt-6 text-center">
            <NuxtLink
              to="/auth/login"
              class="text-sm text-gray-600 hover:text-gray-500"
            >
              Giriş sayfasına dön
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/authStore";

const authStore = useAuthStore();
const route = useRoute();

const form = reactive({
  password: "",
  confirmPassword: "",
});

const isLoading = computed(() => authStore.isLoading);
const error = computed(() => authStore.error);
const passwordReset = ref(false);

// Get token and email from URL
const token = route.query.token;
const userEmail = route.query.email
  ? decodeURIComponent(String(route.query.email))
  : null;

console.log("token:", token);
console.log("userEmail:", userEmail);

// Redirect if no token
if (!token) {
  await navigateTo("/forgot-password");
}

// Validate token format (basic JWT check)
const isValidTokenFormat = computed(() => {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  return parts.length === 3;
});

const isFormValid = computed(() => {
  return (
    form.password &&
    form.confirmPassword &&
    form.password === form.confirmPassword &&
    form.password.length >= 8
  );
});

const handleResetPassword = async () => {
  if (!isFormValid.value) {
    return;
  }

  authStore.clearError();

  try {
    const result = await authStore.resetPasswordWithToken(token, form.password);

    if (result.success) {
      passwordReset.value = true;
    }
  } catch (err) {
    console.error("Password reset failed:", err);
    // The error will be handled by the auth store and displayed via the error computed property
  }
};

// Clear error when form changes
watch([() => form.password, () => form.confirmPassword], () => {
  if (error.value) {
    authStore.clearError();
  }
});
</script>
