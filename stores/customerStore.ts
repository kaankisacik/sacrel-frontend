import type {
  PaginatedResponse,
  StoreCreateCustomerAddress,
  StoreCustomerAddress,
  StoreCustomerResponse,
  StoreUpdateCustomer,
  StoreUpdateCustomerAddress,
} from "@medusajs/types";
import { defineStore } from "pinia";
export const useCustomerStore = defineStore("customerStore", () => {
  const customerService = useCustomer();
  const currentCustomer = ref<StoreCustomerResponse | null>(null);
  const currentCustomerAddresses = ref<
    PaginatedResponse<{ addresses: StoreCustomerAddress[] }>
  >({
    addresses: [],
    limit: 0,
    offset: 0,
    count: 0,
  });
  const isLoading = ref(false);

  // Get customer data
  const getCustomer = async () => {
    isLoading.value = true;
    try {
      const response = await customerService.getCustomer();
      console.log("Current customer data:", response);

      currentCustomer.value = response;
      currentCustomerAddresses.value.addresses =
        response.customer.addresses || [];
    } catch (err) {
      console.error("Failed to get customer:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // get customer addresses
  const getCustomerAddresses = async () => {
    isLoading.value = true;
    try {
      const response = await customerService.getCustomerAddresses();
      currentCustomerAddresses.value = response;
    } catch (err) {
      console.error("Failed to get customer addresses:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateCustomer = async (updateData: Partial<StoreUpdateCustomer>) => {
    isLoading.value = true;
    try {
      const response = await customerService.updateCustomer(updateData);
      currentCustomer.value = response;
      console.log("Customer updated successfully:", response);
    } catch (err) {
      console.error("Failed to update customer:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const addAddress = async (
    addressData: StoreCreateCustomerAddress
  ): Promise<void> => {
    isLoading.value = true;
    try {
      const response: StoreCustomerResponse =
        await customerService.createCustomerAddress(addressData);
      console.log("Customer address added successfully:", response);

      currentCustomer.value = response;
      currentCustomerAddresses.value.addresses =
        response.customer.addresses || [];
    } catch (err) {
      console.error("Failed to add customer address:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateCustomerAddresses = async (
    addressId: string,
    updateData: Partial<StoreUpdateCustomerAddress>
  ) => {
    isLoading.value = true;
    try {
      const response = await customerService.updateCustomerAddress(
        addressId,
        updateData
      );
      console.log("Customer address updated successfully:", response);
      // Refresh addresses after update
      await getCustomerAddresses();
    } catch (err) {
      console.error("Failed to update customer address:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const removeCustomerAddress = async (addressId: string) => {
    isLoading.value = true;
    try {
      await customerService.deleteCustomerAddress(addressId);
      console.log("Customer address removed successfully");
      // Refresh addresses after removal
      await getCustomerAddresses();
    } catch (err) {
      console.error("Failed to remove customer address:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  

  return {
    currentCustomer,
    currentCustomerAddresses,
    getCustomer,
    getCustomerAddresses,
    addAddress,
    updateCustomer,
    updateCustomerAddresses,
    removeCustomerAddress
  };
});
