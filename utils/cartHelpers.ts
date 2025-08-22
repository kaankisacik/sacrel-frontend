interface ICartHelper {
  formatPrice(amount: number): string;
  calculateItemTotal(unitPrice: number, quantity: number): number;
  calculateSubtotal(items: any[]): number;
  calculateTax(subtotal: number, taxRate?: number): number;
  calculateShipping(
    subtotal: number,
    freeShippingThreshold?: number,
    shippingCost?: number
  ): number;
  calculateTotal(subtotal: number, tax: number, shipping: number): number;
  getItemCount(items: any[]): number;
  formatCartItem(lineItem: any): any;
  getVariantTitle(lineItem: any): string;
  getProductImage(lineItem: any): string;
  getVariantsMaxQuantity(
    products: Record<string, any>[],
    variants: Record<string, number>
  ): Record<string, number>;
}

class CartHelper implements ICartHelper {
  formatPrice(amount: number): string {
    return amount.toFixed(2);
  }

  calculateItemTotal(unitPrice: number, quantity: number): number {
    return unitPrice * quantity;
  }

  calculateSubtotal(items: any[]): number {
    return items.reduce((total, item) => {
      const price = item.unit_price || 0;
      const quantity = item.quantity || 0;
      return total + price * quantity;
    }, 0);
  }

  calculateTax(subtotal: number, taxRate: number = 0.18): number {
    return Math.round(subtotal * taxRate);
  }

  calculateShipping(
    subtotal: number,
    freeShippingThreshold: number = 50000,
    shippingCost: number = 3900
  ): number {
    return subtotal >= freeShippingThreshold ? 0 : shippingCost;
  }

  calculateTotal(subtotal: number, tax: number, shipping: number): number {
    return subtotal + tax + shipping;
  }

  getItemCount(items: any[]): number {
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  formatCartItem(lineItem: any): any {
    const variant = lineItem.variant;
    const product = variant?.product;

    return {
      id: lineItem.id,
      title: product?.title || "Ürün",
      variant: this.getVariantTitle(lineItem),
      price: this.formatPrice(lineItem.unit_price || 0),
      quantity: lineItem.quantity || 0,
      total: this.formatPrice(
        this.calculateItemTotal(
          lineItem.unit_price || 0,
          lineItem.quantity || 0
        )
      ),
      image: this.getProductImage(lineItem),
      lineItem: lineItem, // Original line item for API calls
      maxQuantity: variant?.inventory_quantity || 0,
    };
  }

  getVariantTitle(lineItem: any): string {
    const variant = lineItem.variant;
    if (!variant?.options) return "";

    const optionValues = variant.options
      .map((opt: any) => opt.value)
      .join(" - ");
    return optionValues;
  }

  getProductImage(lineItem: any): string {
    const product = lineItem.variant?.product;
    if (product?.images && product.images.length > 0) {
      return product.images[0].url;
    }
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop";
  }
  getVariantsMaxQuantity(
    products: Record<string, any>[],
    variants: Record<string, number>
  ): Record<string, number> {
    const maxQuantities: Record<string, number> = {};
    products.forEach((product) => {
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach((variant: Record<string, any>) => {
          if (variant.id && variant.inventory_quantity !== undefined) {
            maxQuantities[variant.id] = variant.inventory_quantity;
          }
        });
      }
    });
    return maxQuantities;
  }
}

export const cartHelper = new CartHelper();
