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
const favoritesStore = useFavoritesStore()

onMounted(() => {
  // Initialize cart
  cartStore.initCart()
  
  // Initialize favorites
  favoritesStore.init()
  
  // Auth is now initialized in plugin
})
</script>
