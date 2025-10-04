<template>
  <div class="sticky top-0 z-[50] bg-[#FEFCF7]">
    <div class="px-4 ">
      <nav class="w-full flex items-center justify-between py-4 lg:pl-16 lg:pr-8 relative">
        <div class="w-full flex items-center ">
          <!-- Desktop Logo -->
          <div class="hidden lg:flex items-center space-x-6 ">
            <NuxtLink href="/" @click="clearCategoryQuery" class="flex items-center space-x-2 scale-125">
              <img src="/images/sacrel_logo.png" alt="SACREL Logo" width="54.1411859" height="55.4379808"
                class="cursor-pointer hover:opacity-80 transition duration-300 ease-in-out" />
              <span class="text-6xl font-normal text-sacrel-primary transition duration-300 ease-in-out tracking-wider">
                SACREL
              </span>
            </NuxtLink>
          </div>

          <!-- Mobile Logo -->
          <div class="flex lg:hidden items-center space-x-2">
            <NuxtLink href="/" @click="clearCategoryQuery" class="flex items-center space-x-2">
              <img src="/images/sacrel_logo.png" alt="SACREL Logo" width="40" height="40" class="cursor-pointer" />
              <span class="text-2xl font-secondary text-sacrel-primary">SACREL</span>
            </NuxtLink>
          </div>

          <!-- Mobile Menu Button -->
          <button class="block lg:hidden focus:outline-none ml-auto" @click="menuStore.toggleMobileMenu()">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-sacrel-primary" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </button>
        </div>

        <div class="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2">


        </div>
        <div class="hidden lg:flex flex-row items-start space-x-4 mb-2 text-4xl font-mono text-sacrel-primary">
          <!-- User Menu -->
          <div class="relative flex items-start">
            <!-- Search Input that slides from right to left -->
            <input ref="searchInput" v-model="searchQuery" @keyup.enter="performSearch" @blur="handleSearchBlur"
              type="text" placeholder="Ürün ara..."
              class="transition-all duration-300 ease-in-out border-2 border-sacrel-neutral focus:border-sacrel-primary focus:outline-none rounded-lg text-sacrel-primary font-mono text-sm px-2 py-2 mr-0"
              :class="isSearchOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 px-0 mr-0 border-0'" />
            <!-- Search Icon -->
            <Icon name="material-symbols:search"
              class="hover:text-sacrel-accent transition duration-300 ease-in-out cursor-pointer"
              @click="toggleSearch" />
          </div>

          <NuxtLink to="/profile">
            <Icon name="material-symbols:person-outline"
              class=" hover:text-sacrel-accent transition duration-300 ease-in-out cursor-pointer " />
          </NuxtLink>
          <NuxtLink to="/profile/favorites">
            <Icon name="material-symbols:favorite-outline"
              class=" hover:text-sacrel-accent transition duration-300 ease-in-out cursor-pointer" />
          </NuxtLink>
          <NuxtLink to="/cart"
            class=" hover:text-sacrel-accent transition duration-300 ease-in-out flex items-center space-x-1 relative">
            <Icon name="material-symbols:shopping-bag-outline-sharp" class="" />

            <span v-if="totalQuantity > 0"
              class="absolute -top-4 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {{ totalQuantity }}
            </span>
          </NuxtLink>
        </div>
      </nav>
      <!-- <div class=" ml-80 border-b-8">

      </div> -->
    </div>

    <!-- Mobile Menu -->
    <Transition enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in" enter-from-class="opacity-0 transform -translate-x-full"
      leave-to-class="opacity-0 transform -translate-x-full">
      <div v-if="menuStore.isMobileMenuOpen" class="fixed inset-0 z-[60] bg-black bg-opacity-50 lg:hidden"
        @click="menuStore.toggleMobileMenu()">
        <div class="fixed inset-y-0 left-0 w-80 bg-[#FEFCF7] shadow-lg overflow-y-auto" @click.stop>
          <!-- Mobile Menu Header -->
          <div class="flex items-center justify-between p-4 border-b border-sacrel-neutral">
            <NuxtLink to="/" @click="menuStore.toggleMobileMenu()" class="flex items-center space-x-2">
              <img src="/images/sacrel_logo.png" alt="SACREL Logo" width="40" height="40" class="cursor-pointer" />
              <span class="text-2xl font-secondary text-sacrel-primary">SACREL</span>
            </NuxtLink>
            <button @click="menuStore.toggleMobileMenu()"
              class="text-sacrel-primary hover:text-sacrel-accent transition">
              <Icon name="material-symbols:close" class="h-6 w-6" />
            </button>
          </div>

          <!-- Mobile Search -->
          <div class="p-4 border-b border-sacrel-neutral">
            <div class="relative">
              <input v-model="mobileSearchQuery" @keyup.enter="performMobileSearch" type="text"
                placeholder="Ürün ara..."
                class="w-full border-2 border-sacrel-neutral focus:border-sacrel-primary focus:outline-none rounded-lg text-sacrel-primary font-mono text-sm px-3 py-2 pr-10" />
              <button @click="performMobileSearch" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Icon name="material-symbols:search"
                  class="h-5 w-5 text-sacrel-primary hover:text-sacrel-accent transition" />
              </button>
            </div>
          </div>

          <!-- User Actions -->
          <div class="p-4 border-b border-sacrel-neutral">
            <div class="flex flex-col space-y-3">
              <NuxtLink to="/profile" @click="menuStore.toggleMobileMenu()"
                class="flex items-center space-x-3 text-sacrel-primary hover:text-sacrel-accent transition p-2 rounded-lg hover:bg-sacrel-neutral/10">
                <Icon name="material-symbols:person-outline" class="h-6 w-6" />
                <span class="font-medium">Profil</span>
              </NuxtLink>

              <NuxtLink to="/profile/favorites" @click="menuStore.toggleMobileMenu()"
                class="flex items-center space-x-3 text-sacrel-primary hover:text-sacrel-accent transition p-2 rounded-lg hover:bg-sacrel-neutral/10">
                <Icon name="material-symbols:favorite-outline" class="h-6 w-6" />
                <span class="font-medium">Favoriler</span>
              </NuxtLink>

              <NuxtLink to="/cart" @click="menuStore.toggleMobileMenu()"
                class="flex items-center space-x-3 text-sacrel-primary hover:text-sacrel-accent transition p-2 rounded-lg hover:bg-sacrel-neutral/10">
                <Icon name="material-symbols:shopping-bag-outline-sharp" class="h-6 w-6" />
                <span class="font-medium">Sepet</span>
                <span v-if="totalQuantity > 0"
                  class="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-auto">
                  {{ totalQuantity }}
                </span>
              </NuxtLink>

              <NuxtLink to="/profile/orders" @click="menuStore.toggleMobileMenu()"
                class="flex items-center space-x-3 text-sacrel-primary hover:text-sacrel-accent transition p-2 rounded-lg hover:bg-sacrel-neutral/10">
                <Icon name="material-symbols:shopping-bag" class="h-6 w-6" />
                <span class="font-medium">Siparişlerim</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Navigation Menu -->
          <div class="p-4">
            <h3 class="text-lg font-semibold text-sacrel-primary mb-4">Kategoriler</h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink to="/products" @click="clearCategoryQuery(); menuStore.toggleMobileMenu()"
                  class="flex items-center space-x-2 text-sacrel-primary hover:text-sacrel-accent transition p-2 rounded-lg hover:bg-sacrel-neutral/10">
                  <span class="text-sm">▼</span>
                  <span class="font-medium">TÜM ÜRÜNLER</span>
                </NuxtLink>
              </li>
              <li v-for="(category, index) in mobileCategories" :key="index">
                <button @click="goToProductsByCategory(category.handle); menuStore.toggleMobileMenu()"
                  class="w-full flex items-center space-x-2 text-sacrel-primary hover:text-sacrel-accent transition p-2 rounded-lg hover:bg-sacrel-neutral/10 text-left">
                  <span class="text-sm">▲</span>
                  <span>{{ category.name }}</span>
                </button>
              </li>
            </ul>
          </div>

          <!-- Footer Links -->
          <div class="p-4 border-t border-sacrel-neutral mt-auto">
            <div class="flex flex-col space-y-3">
              <NuxtLink to="/about" @click="menuStore.toggleMobileMenu()"
                class="text-sacrel-primary hover:text-sacrel-accent transition font-medium">
                Hakkımızda
              </NuxtLink>
              <NuxtLink to="/contact" @click="menuStore.toggleMobileMenu()"
                class="text-sacrel-primary hover:text-sacrel-accent transition font-medium">
                İletişim
              </NuxtLink>
              <!-- <NuxtLink to="/policies/privacy" @click="menuStore.toggleMobileMenu()"
                class="text-sacrel-primary hover:text-sacrel-accent transition font-medium">
                Gizlilik Politikası
              </NuxtLink>
              <NuxtLink to="/policies/terms" @click="menuStore.toggleMobileMenu()"
                class="text-sacrel-primary hover:text-sacrel-accent transition font-medium">
                Kullanım Şartları
              </NuxtLink> -->

              <!-- Auth Actions -->
              <div v-if="!isUserAuthenticated" class="pt-4 border-t border-sacrel-neutral">
                <NuxtLink to="/auth/login" @click="menuStore.toggleMobileMenu()"
                  class="block w-full text-center bg-sacrel-primary text-white py-2 px-4 rounded-lg hover:bg-sacrel-accent transition font-medium mb-2">
                  Giriş Yap
                </NuxtLink>
                <NuxtLink to="/auth/register" @click="menuStore.toggleMobileMenu()"
                  class="block w-full text-center border-2 border-sacrel-primary text-sacrel-primary py-2 px-4 rounded-lg hover:bg-sacrel-primary hover:text-white transition font-medium">
                  Üye Ol
                </NuxtLink>
              </div>

              <div v-else class="pt-4 border-t border-sacrel-neutral">
                <button @click="logout(); menuStore.toggleMobileMenu()"
                  class="block w-full text-center bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition font-medium">
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const menuStore = useMenuStore();
const authStore = useAuthStore();
const productStore = useProductStore();
const { isUserAuthenticated } = storeToRefs(authStore);
const { totalQuantity } = storeToRefs(useCartStore());
const { logout } = authStore;
const { categoryQuery, selectedCategories, selectedPriceRange, selectedColors, sortBy } = storeToRefs(useProductStore());


// Categories for mobile menu
const { getCategories } = useCategories()
const router = useRouter()
const mobileCategories = ref([])

const fetchCategories = async () => {
  mobileCategories.value = (await getCategories()).product_categories
}

function goToProductsByCategory(categoryHandle) {
  router.push({ path: '/products', query: { category: categoryHandle } });
  categoryQuery.value = categoryHandle;
}

function clearCategoryQuery() {
  categoryQuery.value = "";
  selectedCategories.value = [];
  selectedPriceRange.value = "";
  selectedColors.value = [];
  sortBy.value = "newest";
}

// Search functionality
const isSearchOpen = ref(false);
const searchQuery = ref('');
const mobileSearchQuery = ref('');
const searchInput = ref(null);

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
  if (isSearchOpen.value) {
    nextTick(() => {
      searchInput.value?.focus();
    });
  } else {
    searchQuery.value = '';
  }
};

const handleSearchBlur = () => {
  // Close search if input is empty when it loses focus
  setTimeout(() => {
    if (!searchQuery.value.trim()) {
      isSearchOpen.value = false;
    }
  }, 150);
};

const performSearch = async () => {
  if (searchQuery.value.trim()) {
    // Update the product store search query
    productStore.searchQuery = searchQuery.value;

    // Navigate to products page with search parameter
    await navigateTo(`/products?search=${encodeURIComponent(searchQuery.value)}`);

    // Close the search input
    isSearchOpen.value = false;
  }
};

const performMobileSearch = async () => {
  if (mobileSearchQuery.value.trim()) {
    // Update the product store search query
    productStore.searchQuery = mobileSearchQuery.value;

    // Navigate to products page with search parameter
    await navigateTo(`/products?search=${encodeURIComponent(mobileSearchQuery.value)}`);

    // Close mobile menu and clear search
    menuStore.toggleMobileMenu();
    mobileSearchQuery.value = '';
  }
};

// Close search when pressing Escape
onMounted(() => {
  fetchCategories();

  const handleEscape = (e) => {
    if (e.key === 'Escape' && isSearchOpen.value) {
      isSearchOpen.value = false;
      searchQuery.value = '';
    }
  };

  document.addEventListener('keydown', handleEscape);

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape);
  });
});

</script>