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

  // Additional order utilities
  const getOrderByCartId = async (cartId: string): Promise<any> => {
    try {
      // Since retrieveByCartId doesn't exist in Medusa v2, we'll filter orders by cart_id
      const response = await medusa.store.order.list({
        fields: '*',
        expand: 'items,items.variant,items.variant.product,shipping_address,billing_address',
        cart_id: cartId
      } as any);
      
      if (response.orders && response.orders.length > 0) {
        return { order: response.orders[0] };
      }
      
      throw new Error('Order not found');
    } catch (error) {
      console.error("Order retrieval by cart ID failed:", error);
      throw error;
    }
  };

  const trackOrder = async (orderId: string) => {
    try {
      // Mock tracking data - integrate with actual shipping provider APIs
      return {
        tracking_number: 'TRK123456789',
        status: 'in_transit',
        estimated_delivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        tracking_url: '#',
        events: [
          {
            status: 'picked_up',
            description: 'Sipariş kargo şirketine teslim edildi',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            location: 'İstanbul Depo'
          },
          {
            status: 'in_transit',
            description: 'Sipariş transfer merkezinde',
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            location: 'Ankara Transfer Merkezi'
          }
        ]
      };
    } catch (error: any) {
      console.error('Failed to track order:', error);
      throw error;
    }
  };

  const downloadInvoice = async (orderId: string) => {
    try {
      // Mock invoice download - integrate with actual invoice generation
      const response = await fetch(`/api/orders/${orderId}/invoice`);
      if (!response.ok) throw new Error('Failed to download invoice');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error('Failed to download invoice:', error);
      throw error;
    }
  };

  return {
    // Order retrieval methods
    getOrder,
    getOrders,
    getOrderByCartId,
    // Order transfer methods
    acceptOrderTransfer,
    cancelOrderTransfer,
    declineOrderTransfer,
    requestOrderTransfer,
    // Additional utilities
    trackOrder,
    downloadInvoice,
  };
};