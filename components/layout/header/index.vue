<template>
  <div class="sticky top-0 z-50 ">
    <div class="px-4 ">
      <nav class="flex items-center justify-between py-8 relative">
        <div class="flex items-center space-x-8">
          <div class="hidden lg:flex items-center space-x-6">
            <NuxtLink href="/"
              class="text-8xl font-secondary text-sacrel-primary hover:text-sacrel-accent transition duration-300 ease-in-out">
              SACREL
            </NuxtLink>

          </div>
          <!-- <div class="relative">
              <input type="text" v-model="searchQuery" @keyup.enter="navigateTo(`/products?search=${searchQuery}`)"
                class="sacrel-input border-b-2 border-sacrel-neutral py-2 pr-10 pl-4 focus:outline-none focus:border-sacrel-primary transition duration-300 ease-in-out"
                placeholder="Ara" />
              <button class="absolute inset-y-0 right-0 pr-3 py-2 focus:outline-none">
                <Icon name="uil:search" class="text-sacrel-primary" />
              </button>
            </div> -->
          <button class="block lg:hidden focus:outline-none" @click="menuStore.toggleMobileMenu()">
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
    <div class="lg:hidden" v-if="menuStore.isMobileMenuOpen">
      <ul class="flex flex-col space-y-4 mt-4 px-4 pb-4">
        <li>
          <div class="relative mb-4">
            <input v-model="mobileSearchQuery" @keyup.enter="performMobileSearch" type="text" placeholder="Ürün ara..."
              class="w-full px-4 py-2 border-2 border-sacrel-neutral focus:border-sacrel-primary focus:outline-none rounded-lg text-sacrel-primary font-mono" />
            <button @click="performMobileSearch"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-sacrel-primary hover:text-sacrel-accent">
              <Icon name="material-symbols:search" class="text-lg" />
            </button>
          </div>
        </li>
        <li>
          <NuxtLink href="/products"
            class="sacrel-body font-accent text-sacrel-primary hover:text-sacrel-accent transition duration-300 ease-in-out">
            Ürünler
          </NuxtLink>
        </li>
        <li>
          <NuxtLink href="/about"
            class="sacrel-body font-accent text-sacrel-primary hover:text-sacrel-accent transition duration-300 ease-in-out">
            Hakkımızda
          </NuxtLink>
        </li>
        <li>
          <NuxtLink href="/contact"
            class="sacrel-body font-accent text-sacrel-primary hover:text-sacrel-accent transition duration-300 ease-in-out">
            İletişim
          </NuxtLink>
        </li>
        <li>
          <NuxtLink href="/cart"
            class="sacrel-body font-accent text-sacrel-primary hover:text-sacrel-accent transition duration-300 ease-in-out ">
            <i class="uil uil-shopping-cart"></i>
            <span>Sepet</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink href="/profile"
            class="sacrel-body font-accent text-sacrel-primary hover:text-sacrel-accent transition duration-300 ease-in-out ">
            <i class="uil uil-user"></i>
            <span>Profil</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink href="/profile/orders"
            class="sacrel-body font-accent text-sacrel-primary hover:text-sacrel-accent transition duration-300 ease-in-out ">
            <i class="uil uil-file-alt"></i>
            <span>Siparişlerim</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink href="/profile/favorites"
            class="sacrel-body font-accent text-sacrel-primary hover:text-sacrel-accent transition duration-300 ease-in-out ">
            <i class="uil uil-heart"></i>
            <span>Favorilerim</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink href="/auth/login"
            class="sacrel-body font-accent text-sacrel-primary hover:text-sacrel-accent transition duration-300 ease-in-out ">
            <i class="uil uil-signin"></i>
            <span>Giriş Yap</span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>

const menuStore = useMenuStore();
const authStore = useAuthStore();
const productStore = useProductStore();
const { isUserAuthenticated } = storeToRefs(authStore);
const { totalQuantity } = storeToRefs(useCartStore());
const { logout } = authStore;

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