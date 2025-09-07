<template>
  <div class="min-h-screen flex flex-col !font-accent">
    <NuxtLayout />
  </div>
</template>

<script setup>
onNuxtReady(async () => {
  useAuthStore();
  await useProductStore().getProducts()
});
</script>
