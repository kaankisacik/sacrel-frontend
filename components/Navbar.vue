<template>
  <div class="bg-sacrel-light shadow-md z-50 relative">
    <div class="max-w-screen-2xl container mx-auto px-4">
      <nav class="flex items-center justify-between py-8 relative">
        <div class="flex items-center space-x-8">
          <div class="hidden lg:flex flex-row items-start space-x-4 mb-2 font-accent">
            <template v-if="isAuthenticated">
              <!-- User dropdown menu -->
              <div class="relative" ref="userMenuRef">
                <button
                  @click="toggleUserMenu"
                  class="sacrel-body-sm text-sacrel-neutral hover:text-sacrel-accent transition duration-300 ease-in-out flex items-center space-x-1"
                >
                  <Icon name="uil:user" />
                  <span>{{ fullName || 'Profil' }}</span>
                  <Icon name="uil:angle-down" :class="{ 'rotate-180': showUserMenu }" class="transition-transform duration-200" />
                </button>
                
                <!-- Dropdown menu -->
                <div v-show="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <NuxtLink
                    to="/profile"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="showUserMenu = false"
                  >
                    Profil Bilgileri
                  </NuxtLink>
                  <NuxtLink
                    to="/orders"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="showUserMenu = false"
                  >
                    Siparişlerim
                  </NuxtLink>
                  <NuxtLink
                    to="/favorites"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="showUserMenu = false"
                  >
                    Favorilerim
                  </NuxtLink>
                  <hr class="my-1">
                  <button
                    @click="logout"
                    class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Çıkış Yap
                  </button>
                </div>
              </div>
              
              <router-link to="/cart"
                class="sacrel-body-sm text-sacrel-neutral hover:text-sacrel-accent transition duration-300 ease-in-out flex items-center space-x-1 relative">
                <Icon name="uil:shopping-cart" />
                <span>Sepet</span>
                <span v-if="cartStore.itemCount > 0" 
                      class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {{ cartStore.itemCount }}
                </span>
              </router-link>
            </template>
            
            <template v-else>
              <router-link to="/cart"
                class="sacrel-body-sm text-sacrel-neutral hover:text-sacrel-accent transition duration-300 ease-in-out flex items-center space-x-1 relative">
                <Icon name="uil:shopping-cart" />
                <span>Sepet</span>
                <span v-if="cartStore.itemCount > 0" 
                      class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {{ cartStore.itemCount }}
                </span>
              </router-link>
              
              <NuxtLink to="/login"
                class="sacrel-body-sm text-sacrel-neutral hover:text-sacrel-accent transition duration-300 ease-in-out flex items-center space-x-1">
                <Icon name="uil:signin" />
                <span>Giriş Yap</span>
              </NuxtLink>
              
              <NuxtLink to="/register"
                class="sacrel-body-sm text-white bg-sacrel-accent hover:bg-sacrel-primary transition duration-300 ease-in-out px-3 py-1 rounded">
                Kayıt Ol
              </NuxtLink>
            </template>
          </div>
          <button @click="toggleMobileMenu" class="block lg:hidden focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-sacrel-primary" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </button>
        </div>
        <div class="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2">
          <NuxtLink to="/"
            class="sacrel-heading-xl font-secondary text-sacrel-primary hover:text-sacrel-accent transition duration-300 ease-in-out">
            SACREL</NuxtLink>
          <ul class="flex space-x-6 py-2">
            <li>
              <NuxtLink to="/products"
                class="sacrel-body font-accent text-sacrel-primary hover:text-sacrel-accent transition duration-300 ease-in-out">
                Ürünler</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about"
                class="sacrel-body font-accent text-sacrel-primary hover:text-sacrel-accent transition duration-300 ease-in-out">
                Hakkımızda</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contact"
                class="sacrel-body font-accent text-sacrel-primary hover:text-sacrel-accent transition duration-300 ease-in-out">
                İletişim</NuxtLink>
            </li>
          </ul>
        </div>
        <div class="hidden lg:flex items-center space-x-6">
          <div class="relative">
            <input type="text"
              class="sacrel-input border-b-2 border-sacrel-neutral py-2 pr-10 pl-4 focus:outline-none focus:border-sacrel-primary transition duration-300 ease-in-out"
              placeholder="Ara" />
            <button class="absolute inset-y-0 right-0 pr-3 py-2 focus:outline-none">
              <Icon name="uil:search" class="text-sacrel-primary" />
            </button>
          </div>
        </div>
      </nav>
    </div>
    <div :class="`lg:hidden ${showMobileMenu ? 'block' : 'hidden'}`">
      <ul class="flex flex-col space-y-4 mt-4 px-4 pb-4">
        <li>
          <NuxtLink to="/products"
            class="sacrel-body font-accent text-sacrel-primary hover:text-sacrel-accent transition duration-300 ease-in-out">
            Ürünler</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/about"
            class="sacrel-body font-accent text-sacrel-primary hover:text-sacrel-accent transition duration-300 ease-in-out">
            Hakkımızda</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/contact"
            class="sacrel-body font-accent text-sacrel-primary hover:text-sacrel-accent transition duration-300 ease-in-out">
            İletişim</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/cart"
            class="sacrel-body font-accent text-sacrel-primary hover:text-sacrel-accent transition duration-300 ease-in-out flex items-center space-x-2">
            <Icon name="uil:shopping-cart" />
            <span>Sepet</span>
            <span v-if="cartStore.itemCount > 0" 
                  class="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {{ cartStore.itemCount }}
            </span>
          </NuxtLink>
        </li>
        
        <template v-if="isAuthenticated">
          <li>
            <NuxtLink to="/profile"
              class="sacrel-body font-accent text-sacrel-primary hover:text-sacrel-accent transition duration-300 ease-in-out flex items-center space-x-2">
              <Icon name="uil:user" />
              <span>Profil</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/orders"
              class="sacrel-body font-accent text-sacrel-primary hover:text-sacrel-accent transition duration-300 ease-in-out flex items-center space-x-2">
              <Icon name="uil:file-alt" />
              <span>Siparişlerim</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/favorites"
              class="sacrel-body font-accent text-sacrel-primary hover:text-sacrel-accent transition duration-300 ease-in-out flex items-center space-x-2">
              <Icon name="uil:heart" />
              <span>Favorilerim</span>
            </NuxtLink>
          </li>
          <li>
            <button
              @click="logout"
              class="sacrel-body font-accent text-red-600 hover:text-red-700 transition duration-300 ease-in-out flex items-center space-x-2">
              <Icon name="uil:signout" />
              <span>Çıkış Yap</span>
            </button>
          </li>
        </template>
        
        <template v-else>
          <li>
            <NuxtLink to="/login"
              class="sacrel-body font-accent text-sacrel-primary hover:text-sacrel-accent transition duration-300 ease-in-out flex items-center space-x-2">
              <Icon name="uil:signin" />
              <span>Giriş Yap</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/register"
              class="sacrel-body font-accent text-white bg-sacrel-accent hover:bg-sacrel-primary transition duration-300 ease-in-out px-3 py-2 rounded">
              Kayıt Ol
            </NuxtLink>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const showMobileMenu = ref(false)
const showUserMenu = ref(false)
const showSearch = ref(false)
const searchQuery = ref('')
const userMenuRef = ref(null)
const searchInput = ref(null)

// Initialize auth and cart on component mount
onMounted(() => {
  if (!cartStore.cart) {
    cartStore.initCart()
  }
  if (!authStore.customer) {
    authStore.init()
  }
})

// Authentication state
const isAuthenticated = computed(() => authStore.isAuthenticated)
const customer = computed(() => authStore.customer)
const fullName = computed(() => authStore.fullName)

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  if (showMobileMenu.value) {
    showUserMenu.value = false
    showSearch.value = false
  }
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  if (showUserMenu.value) {
    showMobileMenu.value = false
    showSearch.value = false
  }
}

const toggleSearch = () => {
  showSearch.value = !showSearch.value
  if (showSearch.value) {
    showMobileMenu.value = false
    showUserMenu.value = false
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/products?search=${encodeURIComponent(searchQuery.value)}`)
    showSearch.value = false
    searchQuery.value = ''
  }
}

const loginWithRedirect = () => {
  router.push('/login')
}

const logout = async () => {
  await authStore.logout()
  showUserMenu.value = false
}

// Close dropdowns when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (userMenuRef.value && !userMenuRef.value.contains(e.target)) {
      showUserMenu.value = false
    }
  })
})

// Close mobile menu on route change
watch(() => route.path, () => {
  showMobileMenu.value = false
  showUserMenu.value = false
  showSearch.value = false
})
</script>
