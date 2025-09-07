<template>
  <div>

    <LayoutHeader />
    <div class="flex-grow  mx-auto px-4 py-6 flex">
      <LayoutSide />
      <div class="w-full lg:w-3/4 lg:pr-4">
        <NuxtPage />
      </div>
    </div>
    <LayoutFooter />
  </div>
</template>