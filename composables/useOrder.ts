import type {
  StoreOrderResponse,
  PaginatedResponse,
  StoreOrder,
  StoreAcceptOrderTransfer,
  StoreRequestOrderTransfer
} from "@medusajs/types";

export const useOrders = () => {
  const medusa = useMedusaClient();

  // Order Retrieval
  const getOrder = async (orderId: string): Promise<StoreOrderResponse> => {
    try {
      const response = await medusa.store.order.retrieve(orderId);
      return response;
    } catch (error) {
      console.error("Order retrieval failed:", error);
      throw error;
    }
  };

  const getOrders = async (
    queryParams?: {
      limit?: number;
      offset?: number;
      fields?: string;
      expand?: string;
      [key: string]: any;
    }
  ): Promise<PaginatedResponse<{ orders: StoreOrder[] }>> => {
    try {
      const response = await medusa.store.order.list(queryParams);
      return response;
    } catch (error) {
      console.error("Orders retrieval failed:", error);
      throw error;
    }
  };

  // Order Transfer - Accept
  const acceptOrderTransfer = async (
    orderId: string,
    transferData: StoreAcceptOrderTransfer 
  ): Promise<StoreOrderResponse> => {
    try {
      const response = await medusa.store.order.acceptTransfer(orderId, transferData);
      return response;
    } catch (error) {
      console.error("Order transfer acceptance failed:", error);
      throw error;
    }
  };

  // Order Transfer - Cancel
  const cancelOrderTransfer = async (
    orderId: string
  ): Promise<StoreOrderResponse> => {
    try {
      const response = await medusa.store.order.cancelTransfer(orderId);
      return response;
    } catch (error) {
      console.error("Order transfer cancellation failed:", error);
      throw error;
    }
  };

  // Order Transfer - Decline
  const declineOrderTransfer = async (
    orderId: string,
    transferData: StoreAcceptOrderTransfer
  ): Promise<StoreOrderResponse> => {
    try {
      const response = await medusa.store.order.declineTransfer(orderId, transferData);
      return response;
    } catch (error) {
      console.error("Order transfer decline failed:", error);
      throw error;
    }
  };

  // Order Transfer - Request
  const requestOrderTransfer = async (
    orderId: string,
    transferData: StoreRequestOrderTransfer
  ): Promise<StoreOrderResponse> => {
    try {
      const response = await medusa.store.order.requestTransfer(orderId, transferData);
      return response;
    } catch (error) {
      console.error("Order transfer request failed:", error);
      throw error;
    }
  };

  return {
    // Order retrieval methods
    getOrder,
    getOrders,
    // Order transfer methods
    acceptOrderTransfer,
    cancelOrderTransfer,
    declineOrderTransfer,
    requestOrderTransfer,
  };
};