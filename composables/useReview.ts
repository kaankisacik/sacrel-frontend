export interface ReviewData {
  customer_id: string;
  product_id: string;
  order_id: string;
  rating: number;
  title?: string | null;
  comment?: string | null;
  is_verified_purchase?: boolean;
  status?: "pending" | "approved" | "rejected";
  helpful_count?: number;
}

export const useReview = () => {
  const config = useRuntimeConfig();

  // Review Form Submission
  const createReview = async (reviewData: ReviewData) => {
    try {
      const response = await fetch(
        `${config.public.medusaUrl}/store/products/${reviewData.product_id}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": config.public.medusaPublishableKey || "",
            "Authorization": `Bearer ${localStorage.getItem('medusa_auth_token') || ''}`
          },
          body: JSON.stringify(reviewData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log("Review created successfully:", result);
        return result;
      } else if (response.status === 401) {
        console.error("Unauthorized:", result.error);
        throw new Error("Unauthorized");
      } else {
        console.error("Error:", result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Network error:", error);
      throw error;
    }
  };

  const getProductReviews = async (productId: string) => {
    try {
      const response = await fetch(
        `${config.public.medusaUrl}/store/products/${productId}/reviews`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": config.public.medusaPublishableKey || "",
            "Authorization": `Bearer ${localStorage.getItem('medusa_auth_token') || ''}`
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        return result.reviews || [];
      } else {
        console.error("Error fetching reviews:", result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Network error:", error);
      throw error;
    }
  };

  return {
    createReview,
    getProductReviews,
  };
};
