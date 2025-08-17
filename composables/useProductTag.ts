import type {
} from "@medusajs/types";
import type { ProductTagModel, ProductTagsModel } from "~/models/productTagModel";

export const useProductTags = () => {
  const medusa = useMedusaClient();

  const getProductTag = async (
    productTagId: string
  ): Promise<ProductTagModel> => {
    try {
      const rawResponse = await fetch(
        process.env.NUXT_PUBLIC_MEDUSA_URL + `/store/product-tags/${productTagId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": process.env.NUXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          },
        }
      );
      console.log("Raw response:", await rawResponse.json());

      const response: ProductTagModel = await rawResponse.json();
      return response;
    } catch (error) {
      console.error("Product tag retrieval failed:", error);
      throw error;
    }
  };

  const getProductTags = async (
  ): Promise<ProductTagsModel> => {
    try {
        const rawResponse = await fetch(
        process.env.NUXT_PUBLIC_MEDUSA_URL + `/store/product-tags`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": process.env.NUXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          },
        }
      );
      console.log("Raw response:", await rawResponse.json());

      const response: ProductTagsModel = await rawResponse.json();
      return response;
    } catch (error) {
      console.error("Product tags retrieval failed:", error);
      throw error;
    }
  };

  return {
    getProductTag,
    getProductTags,
  };
};
