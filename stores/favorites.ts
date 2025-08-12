import { defineStore } from 'pinia'

interface FavoriteProduct {
  id: string
  title: string
  subtitle?: string
  thumbnail?: string
  price: number
  variant_id?: string
  created_at: string
}

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: [] as FavoriteProduct[],
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    favoriteCount: (state) => state.favorites.length,
    
    isFavorite: (state) => (productId: string) => {
      return state.favorites.some(item => item.id === productId)
    },
    
    getFavoriteProducts: (state) => state.favorites
  },

  actions: {
    async init() {
      // Load favorites from localStorage
      if (process.client) {
        const saved = localStorage.getItem('favorites')
        if (saved) {
          try {
            this.favorites = JSON.parse(saved)
          } catch (error) {
            console.error('Error parsing saved favorites:', error)
            this.favorites = []
          }
        }
      }
    },

    async addToFavorites(product: any) {
      // Check if already in favorites
      if (this.isFavorite(product.id)) {
        return { success: false, message: 'Ürün zaten favorilerde' }
      }

      const favoriteProduct: FavoriteProduct = {
        id: product.id,
        title: product.title,
        subtitle: product.subtitle,
        thumbnail: product.thumbnail,
        price: product.variants?.[0]?.prices?.[0]?.amount || 0,
        variant_id: product.variants?.[0]?.id,
        created_at: new Date().toISOString()
      }

      this.favorites.unshift(favoriteProduct)
      this.saveFavorites()
      
      return { success: true, message: 'Ürün favorilere eklendi' }
    },

    async removeFromFavorites(productId: string) {
      const index = this.favorites.findIndex(item => item.id === productId)
      
      if (index > -1) {
        this.favorites.splice(index, 1)
        this.saveFavorites()
        return { success: true, message: 'Ürün favorilerden çıkarıldı' }
      }
      
      return { success: false, message: 'Ürün favorilerde bulunamadı' }
    },

    async toggleFavorite(product: any) {
      if (this.isFavorite(product.id)) {
        return await this.removeFromFavorites(product.id)
      } else {
        return await this.addToFavorites(product)
      }
    },

    async clearFavorites() {
      this.favorites = []
      this.saveFavorites()
      return { success: true, message: 'Tüm favoriler temizlendi' }
    },

    saveFavorites() {
      if (process.client) {
        localStorage.setItem('favorites', JSON.stringify(this.favorites))
      }
    },

    clearError() {
      this.error = null
    }
  }
})
