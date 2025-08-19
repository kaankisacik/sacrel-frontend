import type {
  StoreCartResponse,
  StoreCreateCart,
  StoreUpdateCart,
  StoreAddCartLineItem,
  StoreUpdateCartLineItem,
  StoreCartLineItem,
  StoreCompleteCart,
  StoreLineItemDeleteResponse,
  StoreAddCartShippingMethods,
  SelectParams,
} from "@medusajs/types";

export const useCart = () => {
  const medusa = useMedusaClient();

  // Cart ID Management (following useAuth pattern)
  const getCartId = (): string | null => {
    if (import.meta.client) {
      return localStorage.getItem("medusa_cart_id");
    }
    return null;
  };

  const setCartId = (cartId: string): void => {
    if (import.meta.client) {
      localStorage.setItem("medusa_cart_id", cartId);
    }
  };

  const removeCartId = (): void => {
    if (import.meta.client) {
      localStorage.removeItem("medusa_cart_id");
    }
  };

  // Cart Management
  const createCart = async (cartData: StoreCreateCart): Promise<StoreCartResponse> => {
    try {
      const response = await medusa.store.cart.create(cartData);
      return response;
    } catch (error) {
      console.error("Cart creation failed:", error);
      throw error;
    }
  };

  const getCart = async (cartId: string): Promise<StoreCartResponse> => {
    try {
      const response = await medusa.store.cart.retrieve(cartId);
      return response;
    } catch (error) {
      console.error("Cart retrieval failed:", error);
      throw error;
    }
  };

  const updateCart = async (
    cartId: string,
    updateData: StoreUpdateCart
  ): Promise<StoreCartResponse> => {
    try {
      const response = await medusa.store.cart.update(cartId, updateData);
      return response;
    } catch (error) {
      console.error("Cart update failed:", error);
      throw error;
    }
  };

  const transferCart = async (
    cartId: string,
    transferData?: SelectParams
  ): Promise<StoreCartResponse> => {
    try {
      const response = await medusa.store.cart.transferCart(cartId, transferData);
      return response;
    } catch (error) {
      console.error("Cart transfer failed:", error);
      throw error;
    }
  };

  // Line Items Management
  const addLineItem = async (
    cartId: string,
    lineItemData: StoreAddCartLineItem
  ): Promise<StoreCartResponse> => {
    try {
      const response = await medusa.store.cart.createLineItem(cartId, lineItemData);
      return response;
    } catch (error) {
      console.error("Line item addition failed:", error);
      throw error;
    }
  };

  const updateLineItem = async (
    cartId: string,
    lineItemId: string,
    updateData: StoreUpdateCartLineItem
  ): Promise<StoreCartResponse> => {
    try {
      const response = await medusa.store.cart.updateLineItem(cartId, lineItemId, updateData);
      return response;
    } catch (error) {
      console.error("Line item update failed:", error);
      throw error;
    }
  };

  const deleteLineItem = async (cartId: string, lineItemId: string): Promise<StoreLineItemDeleteResponse> => {
    try {
      const response = await medusa.store.cart.deleteLineItem(cartId, lineItemId);
      return response;
    } catch (error) {
      console.error("Line item deletion failed:", error);
      throw error;
    }
  };


  const updatePromotion = async (
    cartId: string,
    promotionData: string[]
  ): Promise<StoreCartResponse> => {
    try {
      const response = await updateCart(cartId, { promo_codes: promotionData });
      return response;
    } catch (error) {
      console.error("Promotion addition failed:", error);
      throw error;
    }
  };



  // Shipping Methods Management
  const addShippingMethod = async (
    cartId: string,
    shippingMethodData: StoreAddCartShippingMethods
  ): Promise<StoreCartResponse> => {
    try {
      const response = await medusa.store.cart.addShippingMethod(cartId, shippingMethodData);
      return response;
    } catch (error) {
      console.error("Shipping method addition failed:", error);
      throw error;
    }
  };


  // Cart Completion
  const completeCart = async (
    cartId: string
  ): Promise<any> => {
    try {
      const response = await medusa.store.cart.complete(cartId);
      return response;
    } catch (error) {
      console.error("Cart completion failed:", error);
      throw error;
    }
  };

  // Higher-level cart operations with ID management
  const getCurrentCart = async (): Promise<StoreCartResponse | null> => {
    try {
      const cartId = getCartId();
      if (!cartId) {
        return null;
      }
      return await getCart(cartId);
    } catch (error) {
      console.error("Failed to get current cart:", error);
      removeCartId(); // Clear invalid cart ID
      return null;
    }
  };

  const createNewCart = async (cartData: StoreCreateCart): Promise<StoreCartResponse> => {
    try {
      const response = await createCart(cartData);
      setCartId(response.cart.id);
      return response;
    } catch (error) {
      console.error("Cart creation failed:", error);
      throw error;
    }
  };

  const addItemToCart = async (variantId: string, quantity: number = 1): Promise<StoreCartResponse> => {
    try {
      let cartId = getCartId();
      
      // Create cart if none exists
      if (!cartId) {
        // This should now be handled by the cart store
        throw new Error('No cart available. Cart should be created first.');
      }

      const lineItemData: StoreAddCartLineItem = {
        variant_id: variantId,
        quantity: quantity
      };

      return await addLineItem(cartId, lineItemData);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      throw error;
    }
  };

  const updateCartLineItem = async (lineItemId: string, quantity: number): Promise<StoreCartResponse> => {
    try {
      const cartId = getCartId();
      if (!cartId) {
        throw new Error('No cart available');
      }

      const updateData: StoreUpdateCartLineItem = { quantity };
      return await updateLineItem(cartId, lineItemId, updateData);
    } catch (error) {
      console.error("Failed to update cart item:", error);
      throw error;
    }
  };

  const removeCartLineItem = async (lineItemId: string): Promise<StoreLineItemDeleteResponse> => {
    try {
      const cartId = getCartId();
      if (!cartId) {
        throw new Error('No cart available');
      }

      return await deleteLineItem(cartId, lineItemId);
    } catch (error) {
      console.error("Failed to remove cart item:", error);
      throw error;
    }
  };

  const clearCurrentCart = (): void => {
    removeCartId();
  };

  return {
    // Low-level API methods
    createCart,
    getCart,
    updateCart,
    addLineItem,
    updateLineItem,
    deleteLineItem,
    updatePromotion,
    addShippingMethod,
    completeCart,
    // High-level cart operations with ID management
    getCurrentCart,
    createNewCart,
    addItemToCart,
    updateCartLineItem,
    removeCartLineItem,
    clearCurrentCart,
  };
};