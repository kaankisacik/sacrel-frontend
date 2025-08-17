interface IProductHelper {
  extractAllProductFilters(
    jsonObjectList: Record<string, any>[]
  ): Record<string, any>;
  extractProductFilters(jsonObject: Record<string, any>): Record<string, any>;
  getColorBgTailwind(color: string): string;
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
}
export const productHelper = new ProductHelper();
