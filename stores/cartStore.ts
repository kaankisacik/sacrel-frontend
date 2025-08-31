import type { StoreCartResponse } from "@medusajs/types";
import { defineStore } from "pinia";

export const useCartStore = defineStore("cartStore", () => {
  const cartService = useCart();
  const cart = ref<StoreCartResponse | null>(null);
  const isLoading = ref(false);
  const error = ref("");

  // Computed property to get the total quantity of items in the cart
  const totalQuantity = computed(() => {
    return (
      cart.value?.cart.items?.reduce(
        (total, item) => total + item.quantity,
        0
      ) || 0
    );
  });

  const createCart = async (): Promise<void> => {
    try {
      isLoading.value = true;
      error.value = "";

   
      cart.value = await cartService.createNewCart();
    } catch (err) {
      console.error("Failed to create cart:", err);
      error.value = "Failed to create cart";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const getCart = async (): Promise<void> => {
    try {
      isLoading.value = true;
      error.value = "";
      cart.value = await cartService.getCurrentCart();
    } catch (err) {
      console.error("Failed to get cart:", err);
      error.value = "Failed to load cart";
      cart.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  const addToCart = async (
    variantId: string,
    quantity: number = 1
  ): Promise<void> => {
    try {
      isLoading.value = true;
      error.value = "";

      // Create cart if none exists
      if (!cart.value) {
        await createCart();
      }

      cart.value = await cartService.addItemToCart(variantId, quantity);
    } catch (err: any) {
      console.error("Failed to add to cart:", err);

      // Handle specific API errors
      if (err.response?.data?.code === "insufficient_inventory") {
        error.value =
          "Stokta yeterli ürün bulunmamaktadır. Sepetinizdeki mevcut miktarla birlikte stok limiti aşılıyor.";
        throw new Error("insufficient_inventory");
      } else if (err.response?.data?.message) {
        error.value = err.response.data.message;
        throw new Error(err.response.data.message);
      } else {
        error.value = "Failed to add item to cart";
        throw err;
      }
    } finally {
      isLoading.value = false;
    }
  };

  const updateCartItem = async (
    lineItemId: string,
    quantity: number
  ): Promise<void> => {
    try {
      if (!cart.value) {
        throw new Error("No cart available");
      }

      isLoading.value = true;
      error.value = "";

      cart.value = await cartService.updateCartLineItem(lineItemId, quantity);
    } catch (err) {
      console.error("Failed to update cart item:", err);
      error.value = "Failed to update cart item";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const removeFromCart = async (lineItemId: string): Promise<void> => {
    try {
      if (!cart.value) {
        throw new Error("No cart available");
      }

      isLoading.value = true;
      error.value = "";

      await cartService.removeCartLineItem(lineItemId);
      // Refresh cart after deletion
      await getCart();
    } catch (err) {
      console.error("Failed to remove from cart:", err);
      error.value = "Failed to remove item from cart";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const clearCart = (): void => {
    cart.value = null;
    cartService.clearCurrentCart();
  };

  // Initialize cart on store creation
  const initializeCart = async (): Promise<void> => {
    await getCart();
  };

  return {
    cart,
    isLoading,
    error,
    totalQuantity,
    createCart,
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    initializeCart,
  };
});
