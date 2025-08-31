export const useContact = () => {
  const config = useRuntimeConfig();
  
  // Contact Form Submission
  const createContactMessage = async (contactData: any) => {
    try {
      const response = await fetch(`${config.public.medusaUrl}/store/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NUXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
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

  // Usage example
  const contactData = {
    name: "John Doe",
    email: "john@example.com", // Required
    phone: "+90 555 123 4567",
    subject: "Product Question",
    message: "I have a question about your products...", // Required
    order_id: "order_12345", // Optional
  };

  createContactMessage(contactData);

  return {};
};
