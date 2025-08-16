import type {
  StoreCustomerResponse,
  StoreUpdateCustomer,
  StoreCreateCustomer,
  StoreCustomerAddressResponse,
  StoreCreateCustomerAddress,
  StoreUpdateCustomerAddress,
  PaginatedResponse,
  StoreCustomerAddress,
} from "@medusajs/types";

export const useCustomer = () => {
  const medusa = useMedusaClient();

  // Customer Management
  const createCustomer = async (customerData: StoreCreateCustomer): Promise<StoreCustomerResponse> => {
    try {
      const response = await medusa.store.customer.create(customerData);
      return response;
    } catch (error) {
      console.error("Customer creation failed:", error);
      throw error;
    }
  };

  const getCustomer = async (): Promise<StoreCustomerResponse> => {
    try {
      const response = await medusa.store.customer.retrieve();
      return response;
    } catch (error) {
      console.error("Customer retrieval failed:", error);
      throw error;
    }
  };

  const updateCustomer = async (
    updateData: Partial<StoreUpdateCustomer>
  ): Promise<StoreCustomerResponse> => {
    try {
      const response = await medusa.store.customer.update(updateData);
      return response;
    } catch (error) {
      console.error("Customer update failed:", error);
      throw error;
    }
  };

  // Customer Address Management
  const getCustomerAddresses = async (): Promise<PaginatedResponse<{ addresses: StoreCustomerAddress[]; }>> => {
    try {
      const response = await medusa.store.customer.listAddress();
      return response;
    } catch (error) {
      console.error("Failed to get customer addresses:", error);
      throw error;
    }
  };

  const getCustomerAddress = async (addressId: string) => {
    try {
      const response = await medusa.store.customer.retrieveAddress(addressId);
      return response;
    } catch (error) {
      console.error("Failed to get customer address:", error);
      throw error;
    }
  };

  const createCustomerAddress = async (
    addressData: StoreCreateCustomerAddress
  ): Promise<StoreCustomerResponse> => {
    try {
      const response = await medusa.store.customer.createAddress(addressData);
      return response;
    } catch (error) {
      console.error("Address creation failed:", error);
      throw error;
    }
  };

  const updateCustomerAddress = async (
    addressId: string,
    updateData: StoreUpdateCustomerAddress
  ): Promise<StoreCustomerResponse> => {
    try {
      const response = await medusa.store.customer.updateAddress(
        addressId,
        updateData
      );
      return response;
    } catch (error) {
      console.error("Address update failed:", error);
      throw error;
    }
  };

  const deleteCustomerAddress = async (addressId: string): Promise<void> => {
    try {
      await medusa.store.customer.deleteAddress(addressId);
    } catch (error) {
      console.error("Address deletion failed:", error);
      throw error;
    }
  };

  return {
    // Customer methods
    createCustomer,
    getCustomer,
    updateCustomer,
    // Address methods
    getCustomerAddresses,
    getCustomerAddress,
    createCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
  };
};
