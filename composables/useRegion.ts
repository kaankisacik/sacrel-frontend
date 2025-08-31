import type {
  FindParams,
  SelectParams,
  StoreRegion,
  StoreRegionFilters,
  StoreRegionListResponse,
  StoreRegionResponse,
} from "@medusajs/types";

export const useRegion = () => {
  const medusa = useMedusaClient();

  const getRegion = async (
    regionId: string,
    queryParams?: SelectParams
  ): Promise<StoreRegionResponse> => {
    try {
      const response = await medusa.store.region.retrieve(
        regionId,
        queryParams
      );
      return response;
    } catch (error) {
      console.error("Region retrieval failed:", error);
      throw error;
    }
  };

  const getTRRegion = async (queryParams?: SelectParams): Promise<StoreRegion> => {
    try {
      const res = await getRegions();
      const region = res.regions.find(
        (r) =>
          r.name === "Türkiye" ||
          r.name === "Turkey" ||
          r.name === "TR" ||
          r.name === "TUR" ||
          r.name === "TURKEY" ||
          r.name === "TURKIYE" ||
          r.currency_code.toUpperCase() === "TRY" ||
          r.currency_code.toUpperCase() === "TL"
      );
      if (!region) {
        throw new Error("Türkiye region not found");
      }
      console.log("Turkey Region Id:",region.id);
      
      return region;
    } catch (error) {
      console.error("Region retrieval failed:", error);
      throw error;
    }
  };

  const getRegions = async (
    queryParams?: FindParams & StoreRegionFilters
  ): Promise<StoreRegionListResponse> => {
    try {
      const response = await medusa.store.region.list({
        ...queryParams,
      });
      return response;
    } catch (error) {
      console.error("Products retrieval failed:", error);
      throw error;
    }
  };

  return {
    getRegion,
    getRegions,
    getTRRegion,
  };
};
