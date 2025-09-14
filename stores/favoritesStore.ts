import type { StoreProduct } from "@medusajs/types";
import type { 
  FavoriteActivity, 
  FavoritesState, 
  FavoriteProductData,
  StoredFavoriteActivity 
} from "~/types/favorites";
import { defineStore } from "pinia";

export const useFavoritesStore = defineStore("favoritesStore", () => {
  // State
  const favorites = ref<string[]>([]);
  const favoriteProducts = ref<StoreProduct[]>([]);
  const activities = ref<FavoriteActivity[]>([]);
  const isLoading = ref(false);
  const error = ref("");
  const isInitialized = ref(false);

  // Services
  const favoritesComposable = useFavorites();
  const productService = useProducts();

  // Computed properties
  const favoriteCount = computed(() => favorites.value.length);
  
  const recentActivities = computed(() => 
    activities.value
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10) // Get last 10 activities
  );

  const hasActivities = computed(() => activities.value.length > 0);

  // Initialize favorites from localStorage
  const initializeFavorites = async (): Promise<void> => {
    try {
      // Avoid duplicate initialization
      if (isInitialized.value) {
        return;
      }

      isLoading.value = true;
      error.value = "";

      // Get favorites from localStorage
      const savedFavorites = favoritesComposable.getFavoriteIds();
      favorites.value = savedFavorites;

      // Load activities from localStorage
      await loadActivities();

      // Load favorite products if any exist
      if (savedFavorites.length > 0) {
        await loadFavoriteProducts();
      }

      isInitialized.value = true;
    } catch (err) {
      console.error("Failed to initialize favorites:", err);
      error.value = "Failed to initialize favorites";
    } finally {
      isLoading.value = false;
    }
  };

  // Load favorite products from API
  const loadFavoriteProducts = async (): Promise<void> => {
    try {
      if (favorites.value.length === 0) {
        favoriteProducts.value = [];
        return;
      }

      isLoading.value = true;
      error.value = "";

      // Only fetch products on client side
      if (!import.meta.client) {
        return;
      }

      // Fetch products by their IDs
      const products: StoreProduct[] = [];
      const failedProductIds: string[] = [];
      
      for (const productId of favorites.value) {
        try {
          const response = await productService.getProduct(productId);
          if (response?.product) {
            products.push(response.product);
          }
        } catch (err) {
          console.warn(`Failed to load product ${productId}:`, err);
          failedProductIds.push(productId);
        }
      }

      // Remove failed products from favorites (silently)
      if (failedProductIds.length > 0) {
        const validFavorites = favorites.value.filter(id => !failedProductIds.includes(id));
        favorites.value = validFavorites;
        favoritesComposable.setFavoriteIds(validFavorites);
      }

      favoriteProducts.value = products;
      
      // If all products failed to load, show a more user-friendly error
      if (products.length === 0 && favorites.value.length > 0) {
        error.value = "Favori ürünleriniz şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin.";
      }
    } catch (err) {
      console.error("Failed to load favorite products:", err);
      error.value = "Favori ürünleriniz yüklenirken bir hata oluştu.";
    } finally {
      isLoading.value = false;
    }
  };

  // Add product to favorites
  const addToFavorites = async (
    productId: string, 
    productData?: FavoriteProductData,
    trackActivity: boolean = true
  ): Promise<void> => {
    try {
      if (!productId || favorites.value.includes(productId)) {
        return;
      }

      // Add to localStorage via composable
      favoritesComposable.addToFavorites(productId);
      
      // Update local state
      favorites.value = [...favorites.value, productId];

      // Track activity if enabled
      if (trackActivity) {
        await addActivity({
          id: generateActivityId(),
          productId,
          action: 'added',
          timestamp: new Date(),
          productTitle: productData?.title,
          productImage: productData?.image,
          productPrice: productData?.price,
        });
      }

      // Reload favorite products
      await loadFavoriteProducts();
    } catch (err) {
      console.error("Failed to add to favorites:", err);
      error.value = "Failed to add to favorites";
      throw err;
    }
  };

  // Remove product from favorites
  const removeFromFavorites = async (
    productId: string,
    trackActivity: boolean = true
  ): Promise<void> => {
    try {
      if (!productId || !favorites.value.includes(productId)) {
        return;
      }

      // Get product data before removing (for activity tracking)
      const productData = favoriteProducts.value.find(p => p.id === productId);

      // Remove from localStorage via composable
      favoritesComposable.removeFromFavorites(productId);
      
      // Update local state
      favorites.value = favorites.value.filter(id => id !== productId);
      favoriteProducts.value = favoriteProducts.value.filter(p => p.id !== productId);

      // Track activity if enabled
      if (trackActivity && productData) {
        await addActivity({
          id: generateActivityId(),
          productId,
          action: 'removed',
          timestamp: new Date(),
          productTitle: productData.title,
          productImage: productData.images?.[0]?.url,
          productPrice: productData.variants?.[0]?.calculated_price?.calculated_amount || undefined,
        });
      }
    } catch (err) {
      console.error("Failed to remove from favorites:", err);
      error.value = "Failed to remove from favorites";
      throw err;
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (
    productId: string,
    productData?: FavoriteProductData
  ): Promise<boolean> => {
    try {
      const isCurrentlyFavorite = isInFavorites(productId);
      
      if (isCurrentlyFavorite) {
        await removeFromFavorites(productId);
        return false;
      } else {
        await addToFavorites(productId, productData);
        return true;
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      throw err;
    }
  };

  // Check if product is in favorites
  const isInFavorites = (productId: string): boolean => {
    return favorites.value.includes(productId);
  };

  // Clear all favorites
  const clearAllFavorites = async (): Promise<void> => {
    try {
      isLoading.value = true;
      error.value = "";

      // Clear localStorage via composable
      favoritesComposable.clearAllFavorites();
      
      // Clear local state
      favorites.value = [];
      favoriteProducts.value = [];

      // Add activity for clearing all
      await addActivity({
        id: generateActivityId(),
        productId: 'all',
        action: 'removed',
        timestamp: new Date(),
        productTitle: 'Tüm favoriler temizlendi',
      });
    } catch (err) {
      console.error("Failed to clear favorites:", err);
      error.value = "Failed to clear favorites";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Activity management
  const addActivity = async (activity: FavoriteActivity): Promise<void> => {
    try {
      activities.value = [activity, ...activities.value];
      
      // Keep only last 50 activities
      if (activities.value.length > 50) {
        activities.value = activities.value.slice(0, 50);
      }

      await saveActivities();
    } catch (err) {
      console.error("Failed to add activity:", err);
    }
  };

  const clearActivities = async (): Promise<void> => {
    try {
      activities.value = [];
      await saveActivities();
    } catch (err) {
      console.error("Failed to clear activities:", err);
      throw err;
    }
  };

  const removeActivity = async (activityId: string): Promise<void> => {
    try {
      activities.value = activities.value.filter(activity => activity.id !== activityId);
      await saveActivities();
    } catch (err) {
      console.error("Failed to remove activity:", err);
      throw err;
    }
  };

  // Activity persistence
  const saveActivities = async (): Promise<void> => {
    if (import.meta.client) {
      try {
        const activitiesToSave = activities.value.map(activity => ({
          ...activity,
          timestamp: activity.timestamp.toISOString(),
        }));
        localStorage.setItem("medusa_favorite_activities", JSON.stringify(activitiesToSave));
      } catch (err) {
        console.error("Failed to save activities to localStorage:", err);
      }
    }
  };

  const loadActivities = async (): Promise<void> => {
    if (import.meta.client) {
      try {
        const savedActivities = localStorage.getItem("medusa_favorite_activities");
        if (savedActivities) {
          const parsed = JSON.parse(savedActivities);
          activities.value = parsed.map((activity: any) => ({
            ...activity,
            timestamp: new Date(activity.timestamp),
          }));
        }
      } catch (err) {
        console.error("Failed to load activities from localStorage:", err);
        activities.value = [];
      }
    }
  };

  // Utility functions
  const generateActivityId = (): string => {
    return `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const getFavoriteProduct = (productId: string): StoreProduct | undefined => {
    return favoriteProducts.value.find(product => product.id === productId);
  };

  // Sync with localStorage when favorites change
  const syncWithLocalStorage = (): void => {
    try {
      const localFavorites = favoritesComposable.getFavoriteIds();
      if (JSON.stringify(favorites.value.sort()) !== JSON.stringify(localFavorites.sort())) {
        favorites.value = localFavorites;
        loadFavoriteProducts();
      }
    } catch (err) {
      console.error("Failed to sync with localStorage:", err);
    }
  };

  return {
    // State
    favorites,
    favoriteProducts,
    activities,
    isLoading,
    error,
    isInitialized,
    
    // Computed
    favoriteCount,
    recentActivities,
    hasActivities,
    
    // Actions
    initializeFavorites,
    loadFavoriteProducts,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isInFavorites,
    clearAllFavorites,
    
    // Activity actions
    clearActivities,
    removeActivity,
    
    // Utility
    getFavoriteProduct,
    syncWithLocalStorage,
  };
});
