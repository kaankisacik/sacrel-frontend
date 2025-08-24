interface CheckoutPricing {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}

interface CheckoutItem {
  id: string;
  title: string;
  variantTitle?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  thumbnail?: string;
}

interface CheckoutSummary {
  items: CheckoutItem[];
  pricing: CheckoutPricing;
  itemCount: number;
}

interface CheckoutValidation {
  isValid: boolean;
  errors: string[];
}

interface FormField {
  name: string;
  value: string;
  isValid: boolean;
  error?: string;
}

class CheckoutHelper {
  // Price formatting
  formatPrice(amount: number): string {
    if (typeof amount !== "number" || isNaN(amount)) return "0,00 TL";
    return `${amount.toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} TL`;
  }

  // Cart summary calculation
  calculateCheckoutSummary(cart: any): CheckoutSummary {
    if (!cart?.items || !Array.isArray(cart.items)) {
      return {
        items: [],
        pricing: this.getEmptyPricing(),
        itemCount: 0,
      };
    }

    console.log("calculateCheckoutSummary", cart);

    const items: CheckoutItem[] = cart.items.map((lineItem: any) => ({
      id: lineItem.id,
      title: lineItem.variant?.product?.title || lineItem.title || "Ürün",
      variantTitle: this.getVariantTitle(lineItem),
      quantity: lineItem.quantity || 0,
      unitPrice: lineItem.unit_price || 0,
      total: (lineItem.unit_price || 0) * (lineItem.quantity || 0),
      thumbnail: this.getItemThumbnail(lineItem),
    }));
    console.log("calculateCheckoutSummary2", items);

    const pricing: CheckoutPricing = {
      subtotal: cart.original_item_subtotal || 0,
      tax: cart.item_tax_total || 0,
      shipping: cart.original_shipping_subtotal || 0,
      discount: cart.discount_total || 0,
      total: cart.original_item_total || 0,
    };

    console.log("calculateCheckoutSummary3", pricing);

    const itemCount = items.reduce((count, item) => count + item.quantity, 0);

    return { items, pricing, itemCount };
  }

  private getEmptyPricing(): CheckoutPricing {
    return {
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 0,
    };
  }

  private getVariantTitle(lineItem: any): string {
    return lineItem.variant_title || "";
  }

  private getItemThumbnail(lineItem: any): string {
    const product = lineItem;

    if (product?.thumbnail) {
      return product.thumbnail;
    }

    if (
      product?.images &&
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      return product.images[0].url || product.images[0];
    }

    // Return the SVG placeholder to avoid 404 requests
    return "/images/placeholder.svg";
  }

  // Form validation
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  validatePhone(phone: string): boolean {
    if (!phone.trim()) return true; // Phone is optional
    const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  }

  validatePostalCode(code: string): boolean {
    const postalRegex = /^[0-9]{5}$/;
    return postalRegex.test(code.trim());
  }

  validateRequired(value: string): boolean {
    return value.trim().length > 0;
  }

  validateCustomerInfo(customerInfo: any): CheckoutValidation {
    const errors: string[] = [];

    if (!this.validateRequired(customerInfo.firstName)) {
      errors.push("Ad alanı zorunludur");
    }

    if (!this.validateRequired(customerInfo.lastName)) {
      errors.push("Soyad alanı zorunludur");
    }

    if (!this.validateRequired(customerInfo.email)) {
      errors.push("E-posta alanı zorunludur");
    } else if (!this.validateEmail(customerInfo.email)) {
      errors.push("Geçerli bir e-posta adresi giriniz");
    }

    if (customerInfo.phone && !this.validatePhone(customerInfo.phone)) {
      errors.push("Geçerli bir telefon numarası giriniz");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  validateShippingAddress(address: any): CheckoutValidation {
    const errors: string[] = [];

    if (!this.validateRequired(address.address_1)) {
      errors.push("Adres alanı zorunludur");
    }

    if (!this.validateRequired(address.city)) {
      errors.push("İl alanı zorunludur");
    }

    if (!this.validateRequired(address.district)) {
      errors.push("İlçe alanı zorunludur");
    }

    if (!this.validateRequired(address.postalCode)) {
      errors.push("Posta kodu alanı zorunludur");
    } else if (!this.validatePostalCode(address.postalCode)) {
      errors.push("Geçerli bir posta kodu giriniz (5 haneli)");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Payment method helpers
  getPaymentMethodName(method: string): string {
    const methodNames: Record<string, string> = {
      credit_card: "Kredi Kartı",
      debit_card: "Banka Kartı",
      bank_transfer: "Banka Havalesi",
      cash_on_delivery: "Kapıda Ödeme",
      paypal: "PayPal",
      stripe: "Stripe",
      manual: "Manuel Ödeme",
    };

    return methodNames[method] || method;
  }

  getPaymentMethodIcon(method: string): string {
    const methodIcons: Record<string, string> = {
      credit_card: "💳",
      debit_card: "💳",
      bank_transfer: "🏦",
      cash_on_delivery: "💵",
      paypal: "🎨",
      stripe: "💸",
      manual: "📝",
    };

    return methodIcons[method] || "💳";
  }

  // Shipping method helpers
  getShippingMethodName(method: any): string {
    return method.name || method.title || "Kargo";
  }

  getShippingMethodPrice(method: any): string {
    const price = method.price || method.amount || 0;
    console.log("Shipping method price:", price);
    return this.formatPrice(price);
  }

  getShippingMethodDescription(method: any): string {
    const estimatedDays = method.estimated_delivery_days;
    if (estimatedDays) {
      return `${estimatedDays} iş günü`;
    }
    return method.description || "";
  }

  // Order reference generation
  generateOrderReference(): string {
    const timestamp = Date.now();
    const randomString = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    return `ORD-${timestamp}-${randomString}`;
  }

  // Step progress helpers
  getStepProgress(currentStep: string): number {
    const steps = ["customer", "shipping", "payment", "review"];
    const currentIndex = steps.indexOf(currentStep);
    return currentIndex >= 0 ? ((currentIndex + 1) / steps.length) * 100 : 0;
  }

  getStepStatus(
    step: string,
    currentStep: string
  ): "completed" | "current" | "upcoming" {
    const steps = ["customer", "shipping", "payment", "review"];
    const stepIndex = steps.indexOf(step);
    const currentIndex = steps.indexOf(currentStep);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  }

  // Error handling
  formatErrorMessage(error: any): string {
    if (typeof error === "string") return error;

    if (error?.response?.data?.message) {
      return error.response.data.message;
    }

    if (error?.message) {
      return error.message;
    }

    return "Beklenmeyen bir hata oluştu";
  }

  // Address formatting
  formatAddress(address: any): string {
    const parts = [
      address.address_1,
      address.district,
      address.city,
      address.postalCode,
    ].filter(Boolean);

    return parts.join(", ");
  }

  // Credit card helpers
  formatCardNumber(value: string): string {
    const cleaned = value.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(" ").substr(0, 19); // Max 16 digits + 3 spaces
  }

  formatExpiryDate(value: string): string {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
    }
    return cleaned;
  }

  validateCardNumber(number: string): boolean {
    const cleaned = number.replace(/\s/g, "");
    return /^[0-9]{13,19}$/.test(cleaned);
  }

  validateExpiryDate(date: string): boolean {
    const [month, year] = date.split("/");
    if (!month || !year || month.length !== 2 || year.length !== 2) {
      return false;
    }

    const monthNum = parseInt(month, 10);
    const yearNum = parseInt("20" + year, 10);
    const now = new Date();
    const expiry = new Date(yearNum, monthNum - 1);

    return monthNum >= 1 && monthNum <= 12 && expiry > now;
  }

  validateCVV(cvv: string): boolean {
    return /^[0-9]{3,4}$/.test(cvv);
  }

  // Utility functions
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Email validation
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Local storage helpers for form persistence
  saveFormData(key: string, data: any): void {
    if (import.meta.client) {
      try {
        localStorage.setItem(`checkout_${key}`, JSON.stringify(data));
      } catch (error) {
        console.warn("Failed to save form data:", error);
      }
    }
  }

  loadFormData(key: string): any {
    if (import.meta.client) {
      try {
        const saved = localStorage.getItem(`checkout_${key}`);
        return saved ? JSON.parse(saved) : null;
      } catch (error) {
        console.warn("Failed to load form data:", error);
        return null;
      }
    }
    return null;
  }

  clearFormData(key: string): void {
    if (import.meta.client) {
      try {
        localStorage.removeItem(`checkout_${key}`);
      } catch (error) {
        console.warn("Failed to clear form data:", error);
      }
    }
  }

 getOrderStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Beklemede',
    completed: 'Tamamlandı',
    shipped: 'Kargoda',
    delivered: 'Teslim Edildi',
    canceled: 'İptal Edildi',
    not_fulfilled: 'Sipariş Oluşturuldu',
    fulfilled: 'Sipariş Hazırlanıyor',
  };
  return statusMap[status] || status;
};
}

export const checkoutHelper = new CheckoutHelper();

// Type exports
export type {
  CheckoutPricing,
  CheckoutItem,
  CheckoutSummary,
  CheckoutValidation,
  FormField,
};
