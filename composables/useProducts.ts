export const useProducts = () => {
  const medusa = useMedusaClient();

  // Tüm ürünleri getir
  const getProducts = async (params?: {
    limit?: number;
    offset?: number;
    region_id?: string;
    category_id?: string[];
    collection_id?: string[];
    tags?: string[];
    order?: string;
    q?: string;
  }) => {
    try {
      const { products, limit, offset, count } =
        await medusa.store.product.list({
          ...params,
          fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
        });
      return { products, limit, offset, count };
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  };

  // Tek ürün getir
  const getProduct = async (productId: string) => {
    try {
      const { product } = await medusa.store.product.retrieve(productId, {
        fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
      });
      return product;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  };

  // get product by handle string
  

  // Kategorileri getir
  const getCategories = async () => {
    try {
      const { product_categories } = await medusa.store.category.list();
      return product_categories || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };

  // Koleksiyonları getir
  const getCollections = async () => {
    try {
      const { collections } = await medusa.store.collection.list();
      return collections;
    } catch (error) {
      console.error("Error fetching collections:", error);
      throw error;
    }
  };

  // Bölgeleri getir
  const getRegions = async () => {
    try {
      const { regions } = await medusa.store.region.list();
      return regions;
    } catch (error) {
      console.error("Error fetching regions:", error);
      throw error;
    }
  };

  // Ürün arama
  const searchProducts = async (query: string, params?: any) => {
    try {
      const searchParams = { q: query, ...params };
      const { products, limit, offset, count } =
        await medusa.store.product.list(searchParams);
      return { products, limit, offset, count };
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  };

  return {
    getProducts,
    getProduct,
    getCategories,
    getCollections,
    getRegions,
    searchProducts,
  };
};
