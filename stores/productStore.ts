import type {
  StoreProductListResponse,
  StoreProductResponse,
} from "@medusajs/types";
import { defineStore } from "pinia";
export const useProductStore = defineStore("productStore", () => {
  const productService = useProducts();
  const searchQuery = ref<string>("");
  const categoryQuery = ref<string>("");
  const sortBy = ref<string>("newest");
  const selectedColors = ref<string[]>([]);
  const selectedPriceRange = ref<string>("");
  const selectedCategories = ref<string[]>([]);
  const product = ref<StoreProductResponse>({} as StoreProductResponse);
  const products = ref<StoreProductListResponse>(
    {} as StoreProductListResponse
  );
  const allProductFilters = ref<Record<string, any>>({});

  const getProduct = async (productId: string) => {
    try {
      product.value = await productService.getProduct(productId);
    } catch (error) {
      console.error("Failed to getting product:", error);
      throw error;
    }
  };

  const getProductByHandle = async (handle: string) => {
    try {
      const response = await productService.getProducts({ handle });
      if (response.products && response.products.length > 0) {
        product.value = {
          product: response.products[0],
        } as StoreProductResponse;
      } else {
        throw new Error("Product not found");
      }
    } catch (error) {
      console.error("Failed to getting product by handle:", error);
      throw error;
    }
  };

  const getProducts = async (queryParams?: any) => {
    try {
      const getProducts = await productService.getProducts({...queryParams});
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


 
    
  

  return {
    product,
    products,
    selectedCategories,
    selectedPriceRange,
    selectedColors,
    sortBy,
    allProductFilters,
    searchQuery,
    categoryQuery,
    getProduct,
    getProducts,
    getProductByHandle,
  };
});
