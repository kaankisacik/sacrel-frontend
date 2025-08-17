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

  return {
    createCart,
    getCart,
    updateCart,
    addLineItem,
    updateLineItem,
    deleteLineItem,
    updatePromotion,
    addShippingMethod,
    completeCart,
  };
};