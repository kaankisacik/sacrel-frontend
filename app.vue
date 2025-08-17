<template>
  <div class="min-h-screen flex flex-col">
    <NuxtLayout />
  </div>
</template>

<script setup>
onNuxtReady(() => {
  useAuthStore();
  useProductStore();
});
</script>
