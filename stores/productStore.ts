import type {
  StoreProductListResponse,
  StoreProductResponse,
} from "@medusajs/types";
import { defineStore } from "pinia";
export const useProductStore = defineStore("productStore", () => {
  const productData = useProducts();
  const product = ref<StoreProductResponse>({} as StoreProductResponse);
  const products = ref<StoreProductListResponse>(
    {} as StoreProductListResponse
  );
  const allProductFilters = ref<Record<string, any>>({});

  const getProduct = async (productId: string) => {
    try {
      product.value = await productData.getProduct(productId);
    } catch (error) {
      console.error("Failed to getting product:", error);
      throw error;
    }
  };

  const getProducts = async (queryParams?: any) => {
    try {
      const getProducts = await productData.getProducts(queryParams);
      products.value = getProducts;

      allProductFilters.value = productHelper.extractAllProductFilters(
        products.value?.products || []
      );
      console.log("Products retrieved:", products.value);
      console.log("All product filters:", allProductFilters.value);
    } catch (error) {
      console.error("Failed to getting products:", error);
      throw error;
    }
  };

  onNuxtReady(() => {
    getProducts();
  });
  return {
    product,
    products,
    allProductFilters,
  };
});
