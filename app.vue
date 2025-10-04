<template>
  <div class="min-h-screen flex flex-col !font-accent max-w-[1920px] mx-auto">
    <NuxtLayout />
  </div>
</template>

<script setup>



onNuxtReady(async () => {
  useAuthStore();
  await useProductStore().getProducts()




});
</script>
