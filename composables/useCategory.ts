import type {
  FindParams,
  StoreProductCategoryListParams,
  StoreProductCategoryListResponse,
  StoreProductCategoryParams,
  StoreProductCategoryResponse,
} from "@medusajs/types";

export const useCategories = () => {
  const medusa = useMedusaClient();

  const getCategory = async (
    categoryId: string,
    queryParams?: StoreProductCategoryParams
  ): Promise<StoreProductCategoryResponse> => {
    try {
      const response = await medusa.store.category.retrieve(
        categoryId,
        queryParams
      );
      return response;
    } catch (error) {
      console.error("Category retrieval failed:", error);
      throw error;
    }
  };

  const getCategories = async (
    queryParams?: FindParams & StoreProductCategoryListParams
  ): Promise<StoreProductCategoryListResponse> => {
    try {
      const response = await medusa.store.category.list(queryParams);
      return response;
    } catch (error) {
      console.error("Categories retrieval failed:", error);
      throw error;
    }
  };

  return {
    getCategory,
    getCategories,
  };
};
