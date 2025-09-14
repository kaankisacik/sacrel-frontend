import type { StoreProduct } from "@medusajs/types";

export const useFavorites = () => {
  // Favorites Management (following cart pattern)
  const getFavoriteIds = (): string[] => {
    if (import.meta.client) {
      const favorites = localStorage.getItem("medusa_favorites");
      if (favorites) {
        try {
          const parsed = JSON.parse(favorites);
          // Filter out invalid values (null, undefined, empty strings)
          return Array.isArray(parsed) 
            ? parsed.filter(id => id && typeof id === 'string' && id.trim() !== '')
            : [];
        } catch (error) {
          console.error("Failed to parse favorites from localStorage:", error);
          // Clear corrupted data
          localStorage.removeItem("medusa_favorites");
          return [];
        }
      }
      return [];
    }
    return [];
  };

  const setFavoriteIds = (favoriteIds: string[]): void => {
    if (import.meta.client) {
      // Filter out invalid values before saving
      const validFavorites = favoriteIds.filter(id => id && typeof id === 'string' && id.trim() !== '');
      localStorage.setItem("medusa_favorites", JSON.stringify(validFavorites));
    }
  };

  const addToFavorites = (productId: string): void => {
    try {
      // Validate productId
      if (!productId || typeof productId !== 'string' || productId.trim() === '') {
        console.error("Invalid productId provided to addToFavorites:", productId);
        return;
      }
      
      const currentFavorites = getFavoriteIds();
      if (!currentFavorites.includes(productId)) {
        const updatedFavorites = [...currentFavorites, productId];
        setFavoriteIds(updatedFavorites);
      }
    } catch (error) {
      console.error("Failed to add to favorites:", error);
      throw error;
    }
  };

  const removeFromFavorites = (productId: string): void => {
    try {
      // Validate productId
      if (!productId || typeof productId !== 'string' || productId.trim() === '') {
        console.error("Invalid productId provided to removeFromFavorites:", productId);
        return;
      }
      
      const currentFavorites = getFavoriteIds();
      const updatedFavorites = currentFavorites.filter(id => id !== productId);
      setFavoriteIds(updatedFavorites);
    } catch (error) {
      console.error("Failed to remove from favorites:", error);
      throw error;
    }
  };

  const clearAllFavorites = (): void => {
    try {
      setFavoriteIds([]);
    } catch (error) {
      console.error("Failed to clear favorites:", error);
      throw error;
    }
  };

  const isInFavorites = (productId: string): boolean => {
    try {
      // Validate productId
      if (!productId || typeof productId !== 'string' || productId.trim() === '') {
        return false;
      }
      
      const currentFavorites = getFavoriteIds();
      return currentFavorites.includes(productId);
    } catch (error) {
      console.error("Failed to check favorite status:", error);
      return false;
    }
  };

  const toggleFavorite = (productId: string): boolean => {
    try {
      // Validate productId
      if (!productId || typeof productId !== 'string' || productId.trim() === '') {
        console.error("Invalid productId provided to toggleFavorite:", productId);
        return false;
      }
      
      if (isInFavorites(productId)) {
        removeFromFavorites(productId);
        return false;
      } else {
        addToFavorites(productId);
        return true;
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      throw error;
    }
  };

  const getFavoriteCount = (): number => {
    try {
      return getFavoriteIds().length;
    } catch (error) {
      console.error("Failed to get favorite count:", error);
      return 0;
    }
  };

  const cleanupFavorites = (): void => {
    try {
      const favorites = getFavoriteIds();
      const validFavorites = favorites.filter(id => id && typeof id === 'string' && id.trim() !== '');
      if (validFavorites.length !== favorites.length) {
        setFavoriteIds(validFavorites);
        console.log("Cleaned up invalid favorite entries");
      }
    } catch (error) {
      console.error("Failed to cleanup favorites:", error);
    }
  };

  return {
    getFavoriteIds,
    addToFavorites,
    removeFromFavorites,
    clearAllFavorites,
    isInFavorites,
    toggleFavorite,
    getFavoriteCount,
    cleanupFavorites,
  };
};
