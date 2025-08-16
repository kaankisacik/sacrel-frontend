import type {
  StoreProductResponse,
  PaginatedResponse,
  StoreProduct,
  StoreProductCategoryResponse,
  StoreProductCategory,
  StoreProductTagResponse,
  StoreProductTag,
  StoreProductTypeResponse,
  StoreProductType,
  StoreProductListParams,
  StoreProductListResponse,
  StoreProductParams,
} from "@medusajs/types";

export const useProducts = () => {
  const medusa = useMedusaClient();


  const getProduct = async (
    productId: string,
    queryParams?: StoreProductParams
  ): Promise<StoreProductResponse> => {
    try {
      const response = await medusa.store.product.retrieve(
        productId,
        queryParams
      );
      return response;
    } catch (error) {
      console.error("Product retrieval failed:", error);
      throw error;
    }
  };

  const getProducts = async (
    queryParams?: StoreProductListParams
  ): Promise<StoreProductListResponse> => {
    try {
      const response = await medusa.store.product.list(queryParams);
      return response;
    } catch (error) {
      console.error("Products retrieval failed:", error);
      throw error;
    }
  };

  return {
    getProduct,
    getProducts,
  };
};
