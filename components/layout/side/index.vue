<template>
  <aside class="hidden lg:block">
    <div class="sticky top-24">
      <ul class="font-medium text-xl font-accent">
        <li>
          <NuxtLink
            to="/products"
            @click="clearCategoryQuery"
            class="block p-2 hover:text-sacrel-accent text-xl 2xl:text-2xl font-semibold underline underline-offset-8 whitespace-nowrap"
            ><span
              :class="'duration-200' + (isOpen ? ' rotate-0' : ' rotate-180')"
              class="transform transition-transform duration-200 inline-block"
              >▼</span
            >
            TÜM ÜRÜNLER</NuxtLink
          >
        </li>
        <li
          v-for="(category, index) in categories"
          :key="index"
          :class="
            'duration-1000' + (isOpen ? '' : ' opacity-0 h-0 overflow-hidden')
          "
        >
          <div
            @click="goToProductsByCategory(category.handle)"
            class="block p-2 hover:text-sacrel-accent cursor-pointer"
          >
            ▲ {{ category.name }}
          </div>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { StoreProductCategory } from "@medusajs/types";

const { getCategories } = useCategories();
const {
  categoryQuery,
  selectedCategories,
  selectedPriceRange,
  selectedColors,
  sortBy,
} = storeToRefs(useProductStore());
const router = useRouter();
const categories = ref<StoreProductCategory[]>([]);
const isOpen = ref(false);

const fetchCategories = async () => {
  categories.value = (await getCategories()).product_categories;
};

function goToProductsByCategory(categoryHandle: string) {
  router.push({ path: "/products", query: { category: categoryHandle } });
  categoryQuery.value = categoryHandle;
}

function clearCategoryQuery() {
  categoryQuery.value = "";
  selectedCategories.value = [];
  selectedPriceRange.value = "";
  selectedColors.value = [];
  sortBy.value = "newest";

  isOpen.value = !isOpen.value;
}
onMounted(() => {
  fetchCategories();
});
</script>
