export const useFetchCategoryByHandle = (handle: string) => {
  const medusa = useMedusaClient()
  
  return useLazyAsyncData(`category:${handle}`, async () => {
    try {
      // First try as category ID
      if (handle.startsWith('pcat_')) {
        const { product_category } = await medusa.store.category.retrieve(handle)
        return { category: product_category }
      }
      
      // Try as collection handle/ID
      if (handle.startsWith('pcol_')) {
        const { collection } = await medusa.store.collection.retrieve(handle)
        return { category: collection }
      }
      
      // Search categories by name/handle
      const { product_categories } = await medusa.store.category.list({ q: handle })
      if (product_categories && product_categories.length > 0) {
        return { category: product_categories[0] }
      }
      
      // Search collections as fallback
      const { collections } = await medusa.store.collection.list({ q: handle })
      if (collections && collections.length > 0) {
        return { category: collections[0] }
      }
      
      throw new Error('Category not found')
    } catch (error: any) {
      console.error('Error fetching category:', error)
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
      })
    }
  })
}

export const useFetchCollectionByHandle = (handle: string) => {
  const medusa = useMedusaClient()
  
  return useLazyAsyncData(`collection:${handle}`, async () => {
    try {
      // First try as collection ID
      if (handle.startsWith('pcol_')) {
        const { collection } = await medusa.store.collection.retrieve(handle)
        return { collection }
      }
      
      // Search collections by handle
      const { collections } = await medusa.store.collection.list({ q: handle })
      if (collections && collections.length > 0) {
        return { collection: collections[0] }
      }
      
      throw new Error('Collection not found')
    } catch (error: any) {
      console.error('Error fetching collection:', error)
      throw createError({
        statusCode: 404,
        statusMessage: 'Collection not found'
      })
    }
  })
}

export const useCategories = () => {
  const medusa = useMedusaClient()
  
  // Get product categories
  const getCategories = async (params?: {
    limit?: number
    offset?: number
    q?: string
    include_descendants_tree?: boolean
  }) => {
    try {
      const { product_categories } = await medusa.store.category.list(params)
      return { categories: product_categories || [], success: true }
    } catch (error: any) {
      console.error('Error fetching categories:', error)
      
      // Fallback to collections if categories don't work
      try {
        const { collections } = await medusa.store.collection.list()
        return { categories: collections || [], success: true }
      } catch (collectionError: any) {
        console.error('Error fetching collections as fallback:', collectionError)
        return { categories: [], success: false, error: error.message || 'Kategoriler getirilemedi' }
      }
    }
  }
  
  // Get single category
  const getCategory = async (categoryId: string) => {
    try {
      const { product_category } = await medusa.store.category.retrieve(categoryId)
      return { category: product_category, success: true }
    } catch (error: any) {
      console.error('Error fetching category:', error)
      
      // Fallback to collection
      try {
        const { collection } = await medusa.store.collection.retrieve(categoryId)
        return { category: collection, success: true }
      } catch (collectionError: any) {
        console.error('Error fetching collection as fallback:', collectionError)
        return { category: null, success: false, error: error.message || 'Kategori getirilemedi' }
      }
    }
  }
  
  // Get products by category
  const getProductsByCategory = async (categoryId: string, params?: {
    limit?: number
    offset?: number
    order?: string
  }) => {
    try {
      const searchParams = {
        category_id: [categoryId],
        ...params
      }
      
      const { products, limit, offset, count } = await medusa.store.product.list(searchParams)
      return { products, limit, offset, count, success: true }
    } catch (error: any) {
      console.error('Error fetching products by category:', error)
      
      // Fallback to collection-based search
      try {
        const searchParams = {
          collection_id: [categoryId],
          ...params
        }
        
        const { products, limit, offset, count } = await medusa.store.product.list(searchParams)
        return { products, limit, offset, count, success: true }
      } catch (collectionError: any) {
        console.error('Error fetching products by collection as fallback:', collectionError)
        return { products: [], success: false, error: error.message || 'Kategori ürünleri getirilemedi' }
      }
    }
  }
  
  return {
    getCategories,
    getCategory,
    getProductsByCategory
  }
}
