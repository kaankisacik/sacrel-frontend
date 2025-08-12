<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
// Default layout with navbar and footer
const cartStore = useCartStore()

// Initialize cart when app loads
onMounted(() => {
  cartStore.initCart()
})
</script>
