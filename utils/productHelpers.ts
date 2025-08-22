interface IProductHelper {
  extractAllProductFilters(
    jsonObjectList: Record<string, any>[]
  ): Record<string, any>;
  extractProductFilters(jsonObject: Record<string, any>): Record<string, any>;
  getColorBgTailwind(color: string): string;
  getAvailableSizesForColor(
    product: Record<string, any>,
    colorValue: string
  ): string[];
  getAvailableColorsForSize(
    product: Record<string, any>,
    sizeValue: string
  ): string[];
  isProductInStock(product: Record<string, any>): boolean;
  getFirstAvailableSize(
    product: Record<string, any>,
    colorValue: string
  ): string | null;
}

class ProductHelper implements IProductHelper {
  extractAllProductFilters(
    jsonObjectList: Record<string, any>[]
  ): Record<string, any> {
    var colors: Record<string, string[]> = {};
    var sizes: Record<string, string[]> = {};
    var types: Record<string, string[]> = {};
    var tags: Record<string, string[]> = {};
    var categories: Record<string, string[]> = {};
    var prices: Record<string, number[]> = {};

    jsonObjectList.map((item) => {
      if (item.categories) {
        item.categories.map((cat: Record<string, any>) => {
          //name as key, id as value
          categories[cat.name] = [...(categories[cat.name] || []), item.id];
        });
      }
      if (item.options) {
        item.options.forEach((option: Record<string, any>) => {
          switch (option.title.toLowerCase().trim()) {
            case "color":
              option.values.map((o: Record<string, any>) => {
                colors[o.value] = [...(colors[o.value] || []), item.id];
              });
              break;
            case "size":
              option.values.map((o: Record<string, any>) => {
                sizes[o.value] = [...(sizes[o.value] || []), item.id];
              });
              break;
            case "type":
              option.values.map((o: Record<string, any>) => {
                types[o.value] = [...(types[o.value] || []), item.id];
              });
              break;
            case "tags":
              option.values.map((o: Record<string, any>) => {
                tags[o.value] = [...(tags[o.value] || []), item.id];
              });
              break;
          }
        });
      }

      if (item.variants && item.variants.length > 0) {
        item.variants.forEach((variant: Record<string, any>) => {
          if (variant.calculated_price) {
            prices[variant.calculated_price.original_amount] = [
              ...(prices[variant.calculated_price.original_amount] || []),
              item.id,
            ];
          }
        });
      }
    });
    return {
      colors,
      sizes,
      types,
      tags,
      categories,
      prices,
    };
  }

  extractProductFilters(jsonObject: Record<string, any>): Record<string, any> {
    var colors: string[] = [];
    var sizes: string[] = [];
    var types: string[] = [];
    var tags: string[] = [];
    var categories: string[] = [];
    var prices: number[] = [];
    jsonObject.categories?.forEach((cat: Record<string, any>) => {
      categories.push(jsonObject.id);
    });

    if (jsonObject.options) {
      jsonObject.options.forEach((option: Record<string, any>) => {
        switch (option.title.toLowerCase().trim()) {
          case "color":
            colors.push(
              ...option.values.map((item: Record<string, any>) => item.value)
            );
            break;
          case "size":
            sizes.push(
              ...option.values.map((item: Record<string, any>) => item.value)
            );
            break;
          case "type":
            types.push(
              ...option.values.map((item: Record<string, any>) => item.value)
            );
            break;
          case "tags":
            tags.push(
              ...option.values.map((item: Record<string, any>) => item.value)
            );
            break;
        }
      });
    }

    jsonObject.variants?.forEach((variant: Record<string, any>) => {
      if (variant.calculated_price) {
        prices.push(variant.calculated_price.original_amount);
      }
    });

    return {
      colors: Array.from(new Set(colors)),
      sizes: Array.from(new Set(sizes)),
      types: Array.from(new Set(types)),
      tags: Array.from(new Set(tags)),
      categories: Array.from(new Set(categories)),
      prices: Array.from(new Set(prices)),
    };
  }

  getColorBgTailwind(color: string): string {
    color = color.toLowerCase().trim();
    const colorMap: Record<string, string> = {
      black: "bg-black",
      white: "bg-white",
      gray: "bg-gray-500",
      purple: "bg-purple-500",
      red: "bg-red-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
    };
    return colorMap[color] || "bg-gray-500";
  }

  // Belirli bir renk için mevcut bedenleri döndürür
  getAvailableSizesForColor(
    product: Record<string, any>,
    colorValue: string
  ): string[] {
    if (!product.variants) return [];
    console.log("Product variants:", product.variants);

    console.log("Available sizes for color:", colorValue);

    const availableSizes = product.variants
      .filter((variant: Record<string, any>) => {
        // Stokta olan ve seçilen renk ile eşleşen varyantları filtrele
        const hasStock = variant.inventory_quantity > 0;
        const hasColor = variant.options?.some(
          (opt: Record<string, any>) =>
            opt.option.title.toLowerCase() === "color" &&
            opt.value === colorValue
        );
        return hasStock && hasColor;
      })
      .map((variant: Record<string, any>) => {
        // Size değerini al
        const sizeOption = variant.options?.find(
          (opt: Record<string, any>) =>
            opt.option.title.toLowerCase() === "size"
        );
        return sizeOption?.value;
      })
      .filter(Boolean); // null/undefined değerleri filtrele

    return Array.from(new Set(availableSizes)); // Tekrarları kaldır
  }

  // Belirli bir beden için mevcut renkleri döndürür
  getAvailableColorsForSize(
    product: Record<string, any>,
    sizeValue: string
  ): string[] {
    if (!product.variants) return [];

    const availableColors = product.variants
      .filter((variant: Record<string, any>) => {
        // Stokta olan ve seçilen beden ile eşleşen varyantları filtrele
        const hasStock = variant.inventory_quantity > 0;
        const hasSize = variant.options?.some(
          (opt: Record<string, any>) =>
            opt.option.title.toLowerCase() === "size" && opt.value === sizeValue
        );
        return hasStock && hasSize;
      })
      .map((variant: Record<string, any>) => {
        // Color değerini al
        const colorOption = variant.options?.find(
          (opt: Record<string, any>) =>
            opt.option.title.toLowerCase() === "color"
        );
        return colorOption?.value;
      })
      .filter(Boolean); // null/undefined değerleri filtrele

    return Array.from(new Set(availableColors)); // Tekrarları kaldır
  }

  // Ürünün genel stok durumunu kontrol eder
  isProductInStock(product: Record<string, any>): boolean {
    if (!product.variants) return false;

    return product.variants.some(
      (variant: Record<string, any>) => variant.inventory_quantity > 0
    );
  }

  // Belirli bir renk için ilk mevcut bedeni döndürür
  getFirstAvailableSize(
    product: Record<string, any>,
    colorValue: string
  ): string | null {
    const availableSizes = this.getAvailableSizesForColor(product, colorValue);
    return availableSizes.length > 0 ? availableSizes[0] || null : null;
  }
}
export const productHelper = new ProductHelper();
