export interface ContactData {
    name: string;
    email: string; // Required
    phone?: string;
    subject?: string;
    message: string; // Required
    order_id?: string; // Optional
}

export const useContact = () => {
  const config = useRuntimeConfig();
  
  // Contact Form Submission
  const createContactMessage = async (contactData: ContactData) => {
    try {
      const response = await fetch(`${config.public.medusaUrl}/store/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": config.public.medusaPublishableKey || "",
        },
        body: JSON.stringify(contactData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Message sent successfully:", result);
        return result;
      } else {
        console.error("Error:", result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Network error:", error);
      throw error;
    }
  };



  return { createContactMessage };
};
