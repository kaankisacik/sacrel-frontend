<template>
  <footer class="py-6 md:py-12 px-4 md:px-6 w-full relative bg-sacrel-primary">
    <!-- Home page specific background applied via ClientOnly to prevent hydration mismatch -->
    <ClientOnly>
      <div
        v-if="isHomePage"
        class="absolute inset-0 bg-footer bg-cover bg-no-repeat"
      ></div>
      <div
        v-if="isHomePage"
        class="absolute inset-0 bg-black bg-opacity-50"
      ></div>
    </ClientOnly>

    <div class="w-full relative z-10">
      <!-- Main SACREL branding -->
      <div class="max-w-6xl mx-auto text-center mb-6 md:mb-12">
        <p class="text-lg sm:text-xl lg:text-4xl text-white mb-2 px-2">
          In Collaboration with MY BUKLE
        </p>
      </div>

      <!-- Content grid -->
      <div
        class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 text-white my-8 sm:my-12 lg:my-24 tracking-[0.1em] lg:tracking-[0.2em] whitespace-normal lg:whitespace-nowrap"
      >
        <!-- Left Column -->
        <div class="text-center lg:text-left text-base sm:text-base lg:text-xl">
          <div class="space-y-3 sm:space-y-4">
            <div>
              <h4 class="mb-2 font-semibold">KURUMSAL</h4>
              <ul class="space-y-1">
                <li>
                  <NuxtLink
                    to="/about"
                    :external="false"
                    class="hover:text-sacrel-accent transition duration-300"
                  >
                    HAKKIMIZDA
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                    to="/products"
                    :external="false"
                    class="hover:text-sacrel-accent transition duration-300"
                  >
                    ÜRÜNLER
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                    to="/auth/register"
                    :external="false"
                    class="hover:text-sacrel-accent transition duration-300"
                  >
                    KAYIT
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Center Column -->
        <div class="text-center text-base sm:text-base lg:text-xl">
          <div class="space-y-3 sm:space-y-4">
            <div>
              <h4 class="mb-2 font-semibold">MESAFELİ SATIŞ SÖZLEŞMESİ</h4>
              <ul class="space-y-1">
                <li>
                  <NuxtLink
                    to="/policies/privacy-policy"
                    :external="false"
                    class="hover:text-sacrel-accent transition duration-300"
                  >
                    GİZLİLİK POLİTİKASI
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                    to="/policies/sales-agreement"
                    :external="false"
                    class="hover:text-sacrel-accent transition duration-300"
                  >
                    SATIŞ SÖZLEŞMESİ
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink
                    to="/policies/consumer-rights"
                    :external="false"
                    class="hover:text-sacrel-accent transition duration-300"
                  >
                    TÜKETİCİ HAKLARI
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="text-center lg:text-right text-base sm:text-base lg:text-xl">
          <div class="space-y-3 sm:space-y-4">
            <div>
              <h4 class="mb-2 font-semibold">İLETİŞİM</h4>
              <div class="space-y-1">
                <p>+90544 264 74 64</p>
                <p class="break-all sm:break-normal">sacrelco@gmail.com</p>
                <p class="font-semibold">İSTANBUL</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Social Media -->
      <div class="max-w-6xl mx-auto text-center mb-6">
        <p class="text-base sm:text-lg lg:text-2xl text-white">
          @sacrel.com.tr
        </p>
      </div>

      <!-- Payment Methods -->
      <div class="max-w-6xl mx-auto text-center">
        <div
          class="flex justify-center space-x-3 sm:space-x-4 lg:space-x-6 mb-6"
        >
          <img
            src="/images/iyzico.png"
            alt="Iyzico"
            class="h-8 sm:h-10 lg:h-14"
          />
          <img
            src="/images/mastercard.png"
            alt="Mastercard"
            class="h-8 sm:h-10 lg:h-14"
          />
          <img src="/images/visa.png" alt="Visa" class="h-8 sm:h-10 lg:h-14" />
        </div>
        <p class="text-xs sm:text-sm text-gray-300 px-4">
          &copy; 2025
          <a
            href="https://www.bonafidayazilim.com"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-sacrel-accent transition duration-300"
          >
            BONAFIDA YAZILIM
          </a>
          . Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  </footer>
</template>
<script setup lang="ts">
const route = useRoute();

// Safer approach for SSR/hydration - always start with false
const isHomePage = ref(false);

// Only update on client-side to prevent hydration mismatch
onMounted(() => {
  isHomePage.value = route.path === "/";
});

// Watch for route changes
watch(
  () => route.path,
  (newPath) => {
    isHomePage.value = newPath === "/";
  }
);
</script>
