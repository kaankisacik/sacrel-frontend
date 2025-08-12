<template>
  <div class="min-h-screen flex flex-col">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Initialize stores on app startup
const cartStore = useCartStore()
const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()

onMounted(() => {
  // Initialize cart
  cartStore.initCart()
  
  // Initialize auth state
  authStore.init()
  
  // Initialize favorites
  favoritesStore.init()
})
</script>
