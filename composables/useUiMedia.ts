

export const useUiMedia = () => {
  const config = useRuntimeConfig();
  

  const getUiCarouselMedias = async () => {
    try {
      const response = await fetch(`${config.public.medusaUrl}/store/ui-media?type=carousel&limit=100`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": config.public.medusaPublishableKey || "",
        },
      });

      const result = await response.json();
      console.log("UI Media");
      
      if (response.ok) {
        console.log("UI Media fetched successfully:", result);
        return result;
      } else {
        console.error("UI Media Error:", result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error(" UI Media Network error:", error);
      throw error;
    }
  };

  const getUiBannerMedias = async () => {
    try {
      const response = await fetch(`${config.public.medusaUrl}/store/ui-media?type=banner&limit=100`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": config.public.medusaPublishableKey || "",
        },
      });

      const result = await response.json();
      console.log("UI Media");
      
      if (response.ok) {
        console.log("UI Media fetched successfully:", result);
        return result;
      } else {
        console.error("UI Media Error:", result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error(" UI Media Network error:", error);
      throw error;
    }
  };

  return {
    getUiCarouselMedias,
    getUiBannerMedias,
  };
};