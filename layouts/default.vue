<template>
  <div>

    <LayoutHeader />
    <div class="flex-grow  mx-auto px-4 pb-6 flex">
      <LayoutSide class="lg:w-[20%] xl:w-[15%]" />
      <div class="w-full lg:w-[80%] xl:w-[85%] lg:pr-4">
        <NuxtPage />
      </div>
    </div>
    <LayoutFooter />
  </div>
</template>