import type {
  StoreProductResponse,
  StoreProductListParams,
  StoreProductListResponse,
  StoreProductParams,
} from "@medusajs/types";

export const useProducts = () => {
  const medusa = useMedusaClient();
  const regionService = useRegion();

  // Check if medusa backend is available
  const checkConnectivity = async (): Promise<boolean> => {
    try {
      if (!import.meta.client) return false;
      
      // Try to fetch a simple endpoint
      const response = await medusa.store.region.list({ limit: 1 });
      return !!response;
    } catch (error) {
      console.warn("Medusa backend not available:", error);
      return false;
    }
  };

  const getProduct = async (
    productId: string,
    queryParams?: StoreProductParams
  ): Promise<StoreProductResponse> => {
    try {
      // Check if we're in a browser environment
      if (!import.meta.client) {
        throw new Error("Product fetching is only available on the client side");
      }

      // Validate product ID
      if (!productId || typeof productId !== 'string' || productId.trim() === '') {
        throw new Error("Invalid product ID provided");
      }

      const response = await medusa.store.product.retrieve(productId, {
        ...queryParams,
        fields:
          "*categories,*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
        region_id: (await regionService.getTRRegion()).id,
      });
      console.log("getProduct response", response);

      return response;
    } catch (error) {
      console.error("Product retrieval failed:", error);
      
      // Provide more specific error messages
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error("Ürün bilgileri alınamadı. Lütfen internet bağlantınızı kontrol edin.");
      } else if (error instanceof Error && error.message.includes('404')) {
        throw new Error("Ürün bulunamadı.");
      } else {
        throw new Error("Ürün bilgileri alınırken bir hata oluştu.");
      }
    }
  };

  const getProducts = async (
    queryParams?: StoreProductListParams
  ): Promise<StoreProductListResponse> => {
    try {
      console.log("getProducts queryParams", queryParams);

      const response = await medusa.store.product.list({
        ...queryParams,
        fields:
          "*categories,*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
        region_id: (await regionService.getTRRegion()).id,
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
    checkConnectivity,
  };
};
