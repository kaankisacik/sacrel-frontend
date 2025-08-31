import type {
  StoreProductResponse,
  StoreProductListParams,
  StoreProductListResponse,
  StoreProductParams,
} from "@medusajs/types";

export const useProducts = () => {
  const medusa = useMedusaClient();
  const regionService = useRegion();

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
      console.log("getProducts queryParams",queryParams);
      
      const response = await medusa.store.product.list({
        ...queryParams,
        fields:
          "*categories,*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
          region_id:(await regionService.getTRRegion()).id
      });
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
