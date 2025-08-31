<template>
  <div class="min-h-screen flex flex-col">
    <NuxtLayout />
  </div>
</template>

<script setup>
onNuxtReady(async () => {
  useAuthStore();
  await useProductStore().getProducts()
  useContact();
});
</script>
