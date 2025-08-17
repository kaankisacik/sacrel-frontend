import type {
} from "@medusajs/types";
import type { ProductTypeModel, ProductTypesModel } from "~/models/productTypeModel";

export const useProductTypes = () => {

  const getProductType = async (
    productTypeId: string
  ): Promise<ProductTypeModel> => {
    try {
      const rawResponse = await fetch(
        process.env.NUXT_PUBLIC_MEDUSA_URL + `/store/product-types/${productTypeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": process.env.NUXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          },
        }
      );
      console.log("Raw response:", await rawResponse.json());

      const response: ProductTypeModel = await rawResponse.json();
      return response;
    } catch (error) {
      console.error("Product type retrieval failed:", error);
      throw error;
    }
  };

  const getProductTypes = async (
  ): Promise<ProductTypesModel> => {
    try {
        const rawResponse = await fetch(
        process.env.NUXT_PUBLIC_MEDUSA_URL + `/store/product-types`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": process.env.NUXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          },
        }
      );
      console.log("Raw response:", await rawResponse.json());

      const response: ProductTypesModel = await rawResponse.json();
      return response;
    } catch (error) {
      console.error("Product types retrieval failed:", error);
      throw error;
    }
  };

  return {
    getProductType,
    getProductTypes,
  };
};
