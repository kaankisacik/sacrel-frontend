<template>
  <div class="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Yeni hesap oluşturun
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Zaten hesabınız var mı?
        <NuxtLink
          to="/auth/login"
          class="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Giriş yapın
        </NuxtLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleRegister">
          <div
            v-if="error"
            class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded"
          >
            {{ error }}
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                for="first_name"
                class="block text-sm font-medium text-gray-700"
              >
                Ad
              </label>
              <div class="mt-1">
                <input
                  id="first_name"
                  v-model="form.first_name"
                  name="first_name"
                  type="text"
                  autocomplete="given-name"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Adınız"
                />
              </div>
            </div>

            <div>
              <label
                for="last_name"
                class="block text-sm font-medium text-gray-700"
              >
                Soyad
              </label>
              <div class="mt-1">
                <input
                  id="last_name"
                  v-model="form.last_name"
                  name="last_name"
                  type="text"
                  autocomplete="family-name"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Soyadınız"
                />
              </div>
            </div>
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
              />
            </div>
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">
              Telefon (Opsiyonel)
            </label>
            <div class="mt-1">
              <input
                id="phone"
                v-model="form.phone"
                name="phone"
                type="tel"
                autocomplete="tel"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="555 123 45 67"
                pattern="[0-9+]*"
                inputmode="numeric"
                maxlength="13"
                @input="
                  (e) => {
                    let value = e.target.value.replace(/[^0-9]/g, '');
                    if (!value.startsWith('90')) {
                      value = '90' + value;
                    }
                    e.target.value = '+' + value;
                    form.phone = '+' + value;
                  }
                "
              />
            </div>
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
            >
              Şifre
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                autocomplete="new-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="En az 8 karakter"
              />
            </div>
            <p class="mt-1 text-sm text-gray-500">En az 8 karakter olmalıdır</p>
          </div>

          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-700"
            >
              Şifre Tekrarı
            </label>
            <div class="mt-1">
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                name="confirmPassword"
                type="password"
                autocomplete="new-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Şifrenizi tekrar girin"
              />
            </div>
          </div>

          <div class="flex items-center">
            <input
              id="terms"
              v-model="form.acceptTerms"
              name="terms"
              type="checkbox"
              required
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-900">
              <NuxtLink
                to="/policies/sales-agreement"
                target="_blank"
                class="text-indigo-600 hover:text-indigo-500"
                >Satış sözleşmesini</NuxtLink
              >
              ve
              <NuxtLink
                to="/policies/privacy-policy"
                target="_blank"
                class="text-indigo-600 hover:text-indigo-500"
                >gizlilik politikasını</NuxtLink
              >
              kabul ediyorum
            </label>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading || !isFormValid"
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
                Hesap oluşturuluyor...
              </span>
              <span v-else>Hesap oluştur</span>
            </button>
          </div>
        </form>

        <div class="mt-6 text-center">
          <NuxtLink to="/" class="text-sm text-gray-600 hover:text-gray-500">
            Ana sayfaya dön
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const error = ref<string | null>(null);
const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
});
const isLoading = ref(false);

const isFormValid = computed(() => {
  console.log(
    "Form validation:",
    form.first_name,
    form.last_name,
    form.email,
    form.password,
    form.confirmPassword,
    form.acceptTerms
  );

  return (
    form.first_name &&
    form.last_name &&
    form.email &&
    form.password &&
    form.confirmPassword &&
    form.password === form.confirmPassword &&
    form.password.length >= 8 &&
    form.acceptTerms
  );
});

const handleRegister = async () => {
  try {
    isLoading.value = true;
    if (form.password !== form.confirmPassword) {
      error.value = "Şifreler eşleşmiyor";
      return;
    }

    if (form.password.length < 8) {
      error.value = "Şifre en az 8 karakter olmalıdır";
      return;
    }

    const userData = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      password: form.password,
      phone: form.phone || undefined,
    };

    await authStore.register(userData as any);
    location.href = "/";
  } catch (err: any) {
    error.value = err.message || "Kayıt sırasında bir hata oluştu";
  } finally {
    isLoading.value = false;
  }
};
</script>
