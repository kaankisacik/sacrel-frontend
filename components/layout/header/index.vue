<template>
  <div class="bg-sacrel-light shadow-md z-50 relative">
    <div class="max-w-screen-2xl container mx-auto px-4">
      <nav class="flex items-center justify-between py-8 relative">
        <div class="flex items-center space-x-8">
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

          <button class="block lg:hidden focus:outline-none" @click="menuStore.toggleMobileMenu()">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-sacrel-primary" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </button>
        </div>

        <div class="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2">
          <NuxtLink href="/"
            class="sacrel-heading-xl font-secondary text-sacrel-primary hover:text-sacrel-accent transition duration-300 ease-in-out">
            SACREL
          </NuxtLink>
          <ul class="hidden lg:flex space-x-6 py-2">
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
          </ul>
        </div>
        <div class="hidden lg:flex flex-row items-start space-x-4 mb-2 font-accent">
          <!-- User Menu -->
          <div v-if="isUserAuthenticated" class="relative" @mouseleave="menuStore.setIsMenuOpen(false)">
            <button @mouseover="menuStore.setIsMenuOpen(true)"
              class="sacrel-body-sm text-sacrel-neutral hover:text-sacrel-accent transition duration-300 ease-in-out flex items-center space-x-1">
              <Icon name="uil:user" class="text-sacrel-neutral" />
              <span>Profil</span>
              <Icon name="uil:angle-down" class="transition-transform duration-200" />
            </button>
            <div class="w-32 h-32 top-0 left-0 absolute" @mouseover="menuStore.setIsMenuOpen(true)">

            </div>
            <!-- Dropdown menu -->
            <div v-if="menuStore.isMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
              @mouseover="menuStore.setIsMenuOpen(true)">
              <NuxtLink href="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profil Bilgileri
              </NuxtLink>
              <NuxtLink href="/profile/orders" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Siparişlerim
              </NuxtLink>
              <NuxtLink href="/profile/favorites" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Favorilerim
              </NuxtLink>
              <hr class="my-1">
              <button class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100" @click="authStore.logout();navigateTo('/')">
                Çıkış Yap
              </button>
            </div>
          </div>
          <NuxtLink v-else href="/auth/login"
            class="sacrel-body-sm text-sacrel-neutral hover:text-sacrel-accent transition duration-300 ease-in-out flex items-center space-x-1">
            <Icon name="lets-icons:sign-in-circle-light" class="text-sacrel-neutral" />
            <span>Giriş Yap</span>
          </NuxtLink>

          <NuxtLink href="/cart"
            class="sacrel-body-sm text-sacrel-neutral hover:text-sacrel-accent transition duration-300 ease-in-out flex items-center space-x-1 relative">
            <Icon name="uil:shopping-cart" class="text-sacrel-neutral" />
            <span>Sepet</span>
            <span class="hidden absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5">
              0
            </span>
          </NuxtLink>
        </div>
      </nav>
    </div>

    <!-- Mobile Menu -->
    <div class="lg:hidden" v-if="menuStore.isMobileMenuOpen">
      <ul class="flex flex-col space-y-4 mt-4 px-4 pb-4">
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
const { isUserAuthenticated } = storeToRefs(authStore)

</script>