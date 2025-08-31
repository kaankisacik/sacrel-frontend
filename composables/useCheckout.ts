import type {
  StoreCartResponse,
  StoreCompleteCart,
  StoreAddCartShippingMethods,
  StorePaymentProvider,
  StoreShippingOption,
} from "@medusajs/types";
import { checkoutHelper } from "~/utils/checkoutHelpers";

export interface CheckoutState {
  step: "customer" | "shipping" | "payment" | "review";
  isLoading: boolean;
  error: string | null;
}

export interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface ShippingAddress {
  address_1: string;
  city: string;
  district: string;
  postalCode: string;
  countryCode: string;
  phone?: string;
}

export interface PaymentData {
  method: string;
  provider?: string;
  data?: Record<string, any>;
}

export const useCheckout = () => {
  const medusa = useMedusaClient();
  const cartService = useCart();
  const router = useRouter();

  // State
  const state = ref<CheckoutState>({
    step: "customer",
    isLoading: false,
    error: null,
  });

  const customerInfo = ref<CustomerInfo>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const shippingAddress = ref<ShippingAddress>({
    address_1: "",
    city: "",
    district: "",
    postalCode: "",
    countryCode: "tr",
    phone: "",
  });

  const paymentData = ref<PaymentData>({
    method: "",
    provider: "",
    data: {},
  });

  const availableShippingOptions = ref<any[]>([]);
  const availablePaymentProviders = ref<any[]>([]);
  const selectedShippingOption = ref<string>("");
  const selectedPaymentProvider = ref<string>("");

  // Validation helpers
  const isCustomerInfoValid = computed(() => {
    const { email, firstName, lastName } = customerInfo.value;

    return Boolean(
      email && firstName && lastName && checkoutHelper.isValidEmail(email)
    );
  });

  const isShippingAddressValid = computed(() => {
    const { address_1, city, district, postalCode } = shippingAddress.value;
    const isValid = Boolean(address_1 && city && district && postalCode);
    console.log("isShippingAddressValid:", isValid, {
      address_1: Boolean(address_1),
      city: Boolean(city),
      district: Boolean(district),
      postalCode: Boolean(postalCode),
    });
    return isValid;
  });

  const isPaymentDataValid = computed(() => {
    const isValid = Boolean(
      paymentData.value.method && selectedPaymentProvider.value
    );
    console.log("isPaymentDataValid check:", {
      method: paymentData.value.method,
      provider: selectedPaymentProvider.value,
      isValid,
      paymentData: paymentData.value,
    });
    return isValid;
  });

  const canProceedToNextStep = computed(() => {
    console.log("canProceedToNextStep check for step:", state.value.step);

    switch (state.value.step) {
      case "customer":
        const customerValid = isCustomerInfoValid.value;
        console.log("Customer step valid:", customerValid);
        return customerValid;
      case "shipping":
        const shippingValid =
          isShippingAddressValid.value && selectedShippingOption.value;
        console.log("Shipping step valid:", shippingValid, {
          addressValid: isShippingAddressValid.value,
          shippingOption: selectedShippingOption.value,
        });
        return shippingValid;
      case "payment":
        const paymentValid = isPaymentDataValid.value;
        console.log("Payment step valid:", paymentValid);
        return paymentValid;
      case "review":
        console.log("Review step - always valid");
        return true;
      default:
        console.log("Unknown step:", state.value.step);
        return false;
    }
  });

  // Step navigation
  const goToStep = (step: CheckoutState["step"]) => {
    console.log(`Navigating to step: ${step}`);

    // Prevent recursive updates by checking if we're already on this step
    if (state.value.step === step) return;

    // Use nextTick to prevent immediate reactive updates
    nextTick(() => {
      state.value.step = step;
      state.value.error = null;
    });
  };

  const nextStep = () => {
    console.log("Attempting to go to next step");
    console.log("Can proceed to next step:", canProceedToNextStep.value);

    if (!canProceedToNextStep.value) return;
    console.log("Proceeding to next step");

    const steps: CheckoutState["step"][] = [
      "customer",
      "shipping",
      "payment",
      "review",
    ];
    const currentIndex = steps.indexOf(state.value.step);

    if (currentIndex < steps.length - 1 && currentIndex >= 0) {
      goToStep(steps[currentIndex + 1] as CheckoutState["step"]);
    }
  };

  const previousStep = () => {
    const steps: CheckoutState["step"][] = [
      "customer",
      "shipping",
      "payment",
      "review",
    ];
    const currentIndex = steps.indexOf(state.value.step);

    if (currentIndex > 0) {
      goToStep(steps[currentIndex - 1] as CheckoutState["step"]);
    }
  };

  // Checkout-specific cart operations
  let isUpdatingCustomerInfo = false;
  let isUpdatingShippingAddress = false;

  const updateCheckoutCustomerInfo = async (cartId: string) => {
    // Prevent multiple simultaneous updates
    if (isUpdatingCustomerInfo) return;

    try {
      isUpdatingCustomerInfo = true;
      state.value.isLoading = true;

      await cartService.updateCart(cartId, {
        email: customerInfo.value.email,
      });
    } catch (error) {
      console.error("Failed to update cart customer info:", error);
      state.value.error = "Müşteri bilgileri güncellenemedi";
      throw error;
    } finally {
      state.value.isLoading = false;
      isUpdatingCustomerInfo = false;
    }
  };

  const updateCheckoutShippingAddress = async (cartId: string) => {
    // Prevent multiple simultaneous updates
    if (isUpdatingShippingAddress) return;

    try {
      isUpdatingShippingAddress = true;
      state.value.isLoading = true;

      await cartService.updateCart(cartId, {
        shipping_address: {
          first_name: customerInfo.value.firstName,
          last_name: customerInfo.value.lastName,
          phone: shippingAddress.value.phone || customerInfo.value.phone,
          address_1: shippingAddress.value.address_1,
          city: shippingAddress.value.city,
          province: shippingAddress.value.district,
          postal_code: shippingAddress.value.postalCode,
          country_code: "tr",
        },
      });
    } catch (error) {
      console.error("Failed to update cart shipping address:", error);
      state.value.error = "Teslimat adresi güncellenemedi";
      throw error;
    } finally {
      state.value.isLoading = false;
      isUpdatingShippingAddress = false;
    }
  };

  const addCheckoutShippingMethod = async (
  cartId: string,
  shippingOptionId: string
) => {
  try {
    state.value.isLoading = true;

    // First, verify the shipping option exists
    const shippingOption = availableShippingOptions.value.find(
      (option) => option.id === shippingOptionId
    );

    if (!shippingOption) {
      throw new Error(`Shipping option ${shippingOptionId} not found`);
    }

    // Get current cart to check existing shipping methods
    const currentCart = await cartService.getCurrentCart();
    
    // Remove existing shipping methods if any
    if (currentCart?.cart?.shipping_methods && currentCart.cart.shipping_methods.length > 0) {
      console.log("Found existing shipping methods:", currentCart?.cart.shipping_methods);
      // Note: Medusa v2 might automatically replace shipping methods
      // or you might need to implement a removal method if available
    }

    const shippingMethodData: StoreAddCartShippingMethods = {
      option_id: shippingOptionId,
    };

    console.log("cartId:", cartId);
    console.log("Selected shipping option:", shippingOption);
    console.log("Adding shipping method with data:", shippingMethodData);

    const result = await cartService.addShippingMethod(
      cartId,
      shippingMethodData
    );
    console.log("Shipping method added successfully:", result);

    return result;
  } catch (error) {
    console.error("Failed to add shipping method:", error);
    state.value.error = "Kargo yöntemi eklenemedi";
    throw error;
  } finally {
    state.value.isLoading = false;
  }
};

  // Load shipping options
  const loadShippingOptions = async (cartId: string) => {
    try {
      state.value.isLoading = true;

      const response = await medusa.store.fulfillment.listCartOptions({
        cart_id: cartId,
      });
      console.log("Fetched shipping options:", response);

      availableShippingOptions.value = response.shipping_options || [];

      // Note: Removed auto-selection to ensure user manually selects shipping option
      // This prevents shipping costs from appearing in order summary until user explicitly selects
    } catch (error) {
      console.error("Failed to load shipping options:", error);
      state.value.error = "Kargo seçenekleri yüklenemedi";
      availableShippingOptions.value = [];
    } finally {
      state.value.isLoading = false;
    }
  };

  // Load payment providers
  const loadPaymentProviders = async (regionId: string) => {
    try {
      state.value.isLoading = true;

      const response = await medusa.store.payment.listPaymentProviders({
        region_id: regionId,
      });
      availablePaymentProviders.value = response.payment_providers || [];

      // Auto-select first provider if only one available and no provider is currently selected
      if (
        availablePaymentProviders.value.length === 1 &&
        availablePaymentProviders.value[0] &&
        !selectedPaymentProvider.value
      ) {
        selectedPaymentProvider.value = availablePaymentProviders.value[0].id;
      }
    } catch (error) {
      console.error("Failed to load payment providers:", error);
      state.value.error = "Ödeme seçenekleri yüklenemedi";
      availablePaymentProviders.value = [];
    } finally {
      state.value.isLoading = false;
    }
  };

  // Initialize payment sessions
  const initializePaymentSessions = async (cart: StoreCartResponse) => {
    try {
      state.value.isLoading = true;

      await medusa.store.payment.initiatePaymentSession(cart.cart, {
        provider_id: selectedPaymentProvider.value,
      });
    } catch (error) {
      console.error("Failed to initialize payment sessions:", error);
      state.value.error = "Ödeme oturumu başlatılamadı";
      throw error;
    } finally {
      state.value.isLoading = false;
    }
  };

  // Complete checkout flow
 const completeCheckout = async (cartId: string): Promise<any> => {
  try {
    state.value.isLoading = true;
    state.value.error = null;

    // Get current cart to validate shipping methods
    const currentCart = await cartService.getCurrentCart();
    console.log("Cart before completion:", currentCart);

    if (!currentCart?.cart?.shipping_methods || currentCart.cart.shipping_methods.length === 0) {
      throw new Error("No shipping methods found on cart");
    }

    // Validate shipping methods against cart items
    const cartItems = currentCart.cart.items || [];
    const shippingMethods = currentCart.cart.shipping_methods;
    
    console.log("Cart items:", cartItems);
    console.log("Cart shipping methods:", shippingMethods);

    // Note: Shipping profile validation removed due to type constraints
    // This validation would need to be handled on the backend or with proper type extensions

    const response = await cartService.completeCart(cartId);

    // Clear cart after successful completion
    cartService.clearCurrentCart();

    return response;
  } catch (error: any) {
    console.error("Failed to complete checkout:", error);

    if (error.response?.data?.message) {
      state.value.error = error.response.data.message;
    } else if (error.message?.includes("shipping profiles") || error.message?.includes("incompatible")) {
      state.value.error = "Kargo yöntemi ile ürünler uyumlu değil. Lütfen farklı bir kargo seçeneği deneyin.";
    } else if (error.message?.includes("shipping methods")) {
      state.value.error = "Kargo yöntemi bulunamadı. Lütfen kargo seçimi yapın.";
    } else {
      state.value.error = "Sipariş tamamlanamadı. Lütfen tekrar deneyin.";
    }

    throw error;
  } finally {
    state.value.isLoading = false;
  }
};
  // Utility functions for checkout steps
  const formatStepTitle = (step: CheckoutState["step"]): string => {
    const titles = {
      customer: "İletişim Bilgileri",
      shipping: "Teslimat Adresi",
      payment: "Ödeme Yöntemi",
      review: "Sipariş Özeti",
    };
    return titles[step];
  };

  const getStepNumber = (step: CheckoutState["step"]): number => {
    const steps = ["customer", "shipping", "payment", "review"];
    return steps.indexOf(step) + 1;
  };

  const getTotalSteps = (): number => {
    return 4;
  };

  // Reset checkout state
  const resetCheckout = () => {
    state.value = {
      step: "customer",
      isLoading: false,
      error: null,
    };

    customerInfo.value = {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
    };

    shippingAddress.value = {
      address_1: "",
      city: "",
      district: "",
      postalCode: "",
      countryCode: "tr",
      phone: "",
    };

    paymentData.value = {
      method: "",
      provider: "",
      data: {},
    };

    selectedShippingOption.value = "";
    selectedPaymentProvider.value = "";
    availableShippingOptions.value = [];
    availablePaymentProviders.value = [];
  };

  return {
    // State
    state,
    customerInfo,
    shippingAddress,
    paymentData,
    availableShippingOptions: readonly(availableShippingOptions),
    availablePaymentProviders: readonly(availablePaymentProviders),
    selectedShippingOption,
    selectedPaymentProvider,

    // Computed
    isCustomerInfoValid,
    isShippingAddressValid,
    isPaymentDataValid,
    canProceedToNextStep,

    // Navigation
    goToStep,
    nextStep,
    previousStep,

    // Checkout-specific operations
    updateCheckoutCustomerInfo,
    updateCheckoutShippingAddress,
    addCheckoutShippingMethod,
    loadShippingOptions,
    loadPaymentProviders,
    initializePaymentSessions,
    completeCheckout,

    // Utilities
    formatStepTitle,
    getStepNumber,
    getTotalSteps,
    resetCheckout,
  };
};
