// Pinia plugin to initialize favorites store
export default defineNuxtPlugin(async () => {
  const favoritesStore = useFavoritesStore();
  
  // Initialize favorites when the app starts (client-side only)
  if (import.meta.client) {
    try {
      // Wait for Vue to be ready
      await nextTick();
      // Initialize favorites store
      await favoritesStore.initializeFavorites();
    } catch (error) {
      console.error('Failed to initialize favorites in plugin:', error);
    }
  }
});
