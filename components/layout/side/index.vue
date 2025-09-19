<template>
    <aside class=" hidden lg:block lg:w-1/4">
        <div class="sticky top-56">
            <ul class=" font-medium text-xl font-accent">
                <li>
                    <NuxtLink to="/products" @click="clearCategoryQuery"
                        class="block p-2 hover:text-sacrel-accent text-2xl font-semibold underline underline-offset-8">▼
                        TÜM ÜRÜNLER</NuxtLink>
                </li>
                <li v-for="(category, index) in categories" :key="index">
                    <div @click="goToProductsByCategory(category.handle)"
                        class="block p-2 hover:text-sacrel-accent cursor-pointer">▲
                        {{
                            category.name }}</div>
                </li>
            </ul>
        </div>
    </aside>
</template>

<script setup lang="ts">
import type { StoreProductCategory } from '@medusajs/types';


const { getCategories } = useCategories()
const { categoryQuery } = storeToRefs(useProductStore())
const router = useRouter()
const categories = ref<StoreProductCategory[]>([])

const fetchCategories = async () => {
    categories.value = (await getCategories()).product_categories
}

function goToProductsByCategory(categoryHandle: string) {
    router.push({ path: '/products', query: { category: categoryHandle } });
    categoryQuery.value = categoryHandle;
}

function clearCategoryQuery() {
    categoryQuery.value = '';
}
onMounted(() => {
    fetchCategories()
})

</script>
