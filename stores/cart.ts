import { defineStore } from 'pinia'

interface CartItem {
  id: string
  variant_id: string
  product_id: string
  quantity: number
  title: string
  subtitle?: string
  thumbnail?: string
  unit_price: number
  total: number
  variant?: {
    id: string
    title: string
    product: {
      id: string
      title: string
      thumbnail?: string
    }
    calculated_price?: {
      calculated_amount: number
      original_amount: number
    }
  }
  product?: {
    id: string
    title: string
    thumbnail?: string
    handle: string
  }
  metadata?: Record<string, any>
}

interface ShippingMethod {
  id: string
  name: string
  amount: number
  is_return: boolean
  admin_only: boolean
  price_type: string
}

interface PaymentSession {
  id: string
  amount: number
  currency_code: string
  provider_id: string
  is_selected: boolean
  status: string
  data: Record<string, any>
}

interface Region {
  id: string
  name: string
  currency_code: string
  countries: Array<{
    id: number
    iso_2: string
    iso_3: string
    name: string
    display_name: string
  }>
}

interface Cart {
  id: string
  items: CartItem[]
  total: number
  subtotal: number
  tax_total: number
  shipping_total: number
  discount_total: number
  gift_card_total: number
  region_id: string
  region?: Region
  email?: string
  billing_address?: any
  shipping_address?: any
  shipping_methods: ShippingMethod[]
  payment_sessions: PaymentSession[]
  customer_id?: string
  type: string
  completed_at?: string
  created_at: string
  updated_at: string
  deleted_at?: string
  metadata?: Record<string, any>
  sales_channel_id?: string
  promo_codes?: string[]
  promotions?: any[]
}

interface PromotionFormState {
  message: string
  type?: 'error' | 'success'
}

interface AddressFormData {
  first_name: string
  last_name: string
  company?: string
  address_1: string
  address_2?: string
  city: string
  province: string
  postal_code: string
  country_code: string
  phone?: string
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: null as Cart | null,
    isLoading: false,
    error: null as string | null,
    shippingMethods: [] as ShippingMethod[],
    paymentMethods: [] as any[],
    promotionFormState: null as PromotionFormState | null,
  }),

  getters: {
    itemCount: (state) => {
      if (!state.cart) return 0
      return state.cart.items.reduce((total, item) => total + item.quantity, 0)
    },
    
    isEmpty: (state) => {
      return !state.cart || state.cart.items.length === 0
    },

    formattedTotal: (state) => {
      if (!state.cart) return '0 TL'
      return `${state.cart.total.toLocaleString('tr-TR')} TL`
    },

    formattedSubtotal: (state) => {
      if (!state.cart) return '0 TL'
      return `${state.cart.subtotal.toLocaleString('tr-TR')} TL`
    },

    formattedTaxTotal: (state) => {
      if (!state.cart) return '0 TL'
      return `${state.cart.tax_total.toLocaleString('tr-TR')} TL`
    },

    formattedShippingTotal: (state) => {
      if (!state.cart) return '0 TL'
      return `${state.cart.shipping_total.toLocaleString('tr-TR')} TL`
    },

    formattedDiscountTotal: (state) => {
      if (!state.cart) return '0 TL'
      return `${state.cart.discount_total.toLocaleString('tr-TR')} TL`
    },

    hasShippingAddress: (state) => {
      return state.cart?.shipping_address !== null
    },

    hasBillingAddress: (state) => {
      return state.cart?.billing_address !== null
    },

    selectedPaymentSession: (state) => {
      return state.cart?.payment_sessions?.find(session => session.is_selected)
    },

    isReadyForCheckout: (state) => {
      if (!state.cart) return false
      return (
        state.cart.items.length > 0 &&
        state.cart.shipping_address &&
        state.cart.billing_address &&
        state.cart.shipping_methods.length > 0
      )
    },

    currentCountryCode: (state) => {
      if (!state.cart?.region) return null
      return state.cart.region.countries?.[0]?.iso_2 || null
    }
  },

  actions: {
    async initCart() {
      if (import.meta.client) {
        await this.retrieveCart()
      }
    },

    async getToken() {
      if (import.meta.client) {
        return localStorage.getItem("medusa_auth_token")
      }
      return null
    },

    async getCartId() {
      if (import.meta.client) {
        return localStorage.getItem("cart_id")
      }
      return null
    },

    async setCartId(cartId: string) {
      if (import.meta.client) {
        localStorage.setItem("cart_id", cartId)
      }
    },

    async removeCartId() {
      if (import.meta.client) {
        localStorage.removeItem("cart_id")
      }
    },

    async retrieveCart(cartId?: string) {
      const id = cartId || await this.getCartId()
      
      if (!id) {
        return null
      }

      this.isLoading = true
      this.error = null

      try {
        const client = useMedusaClient()
        const authToken = await this.getToken()
        
        const headers: Record<string, string> = {}
        if (authToken) {
          headers.Authorization = `Bearer ${authToken}`
        }

        const { cart } = await client.store.cart.retrieve(id, {
          fields: "*items, *region, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions, +shipping_methods.name"
        }, headers)

        this.cart = cart as unknown as Cart
        return cart
      } catch (error: any) {
        console.error('Error retrieving cart:', error)
        this.error = error.message || 'Sepet getirilemedi'
        return null
      } finally {
        this.isLoading = false
      }
    },

    async getOrSetCart(countryCode: string) {
      const { getRegion } = useData()
      const region = await getRegion(countryCode)

      if (!region) {
        throw new Error(`Region not found for country code: ${countryCode}`)
      }

      let cart = await this.retrieveCart()

      const authToken = await this.getToken()
      const headers: Record<string, string> = {}
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`
      }

      if (!cart) {
        // Create new cart
        const client = useMedusaClient()
        const { cart: newCart } = await client.store.cart.create({
          region_id: region.id
        }, {}, headers)

        this.cart = newCart as unknown as Cart
        await this.setCartId(newCart.id)
        cart = newCart
      }

      if (cart && cart.region_id !== region.id) {
        // Update cart region
        const updatedCart = await this.updateCart({
          region_id: region.id
        })
        cart = updatedCart
      }

      return cart
    },

    async updateCart(data: any) {
      const cartId = await this.getCartId()

      if (!cartId) {
        throw new Error('No cart ID found')
      }

      this.isLoading = true
      this.error = null

      try {
        const client = useMedusaClient()
        const authToken = await this.getToken()
        
        const headers: Record<string, string> = {}
        if (authToken) {
          headers.Authorization = `Bearer ${authToken}`
        }

        const { cart } = await client.store.cart.update(cartId, data, {}, headers)
        this.cart = cart as unknown as Cart
        return cart
      } catch (error: any) {
        this.error = error.message || 'Sepet güncellenemedi'
        console.error('Error updating cart:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async addToCart({
      variantId,
      quantity,
      countryCode
    }: {
      variantId: string
      quantity: number
      countryCode: string
    }) {
      if (!variantId) {
        throw new Error('Variant ID is required')
      }

      const cart = await this.getOrSetCart(countryCode)

      if (!cart) {
        throw new Error('Cart could not be created or retrieved')
      }

      this.isLoading = true
      this.error = null

      try {
        const client = useMedusaClient()
        const authToken = await this.getToken()
        
        const headers: Record<string, string> = {}
        if (authToken) {
          headers.Authorization = `Bearer ${authToken}`
        }

        await client.store.cart.createLineItem(
          cart.id,
          {
            variant_id: variantId,
            quantity
          },
          {},
          headers
        )

        // Refresh cart after adding item
        await this.retrieveCart(cart.id)

        return { success: true }
      } catch (error: any) {
        this.error = error.message || 'Ürün sepete eklenemedi'
        console.error('Error adding to cart:', error)
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async updateLineItem({
      lineId,
      quantity
    }: {
      lineId: string
      quantity: number
    }) {
      if (!lineId) {
        throw new Error('Line ID is required')
      }

      const cartId = await this.getCartId()

      if (!cartId) {
        throw new Error('No cart ID found')
      }

      this.isLoading = true
      this.error = null

      try {
        const client = useMedusaClient()
        const authToken = await this.getToken()
        
        const headers: Record<string, string> = {}
        if (authToken) {
          headers.Authorization = `Bearer ${authToken}`
        }

        await client.store.cart.updateLineItem(cartId, lineId, { quantity }, {}, headers)

        // Refresh cart after updating item
        await this.retrieveCart(cartId)

        return { success: true }
      } catch (error: any) {
        this.error = error.message || 'Ürün güncellenemedi'
        console.error('Error updating line item:', error)
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async deleteLineItem(lineId: string) {
      if (!lineId) {
        throw new Error('Line ID is required')
      }

      const cartId = await this.getCartId()

      if (!cartId) {
        throw new Error('No cart ID found')
      }

      this.isLoading = true
      this.error = null

      try {
        const client = useMedusaClient()
        const authToken = await this.getToken()
        
        const headers: Record<string, string> = {}
        if (authToken) {
          headers.Authorization = `Bearer ${authToken}`
        }

        await client.store.cart.deleteLineItem(cartId, lineId, headers)

        // Refresh cart after deleting item
        await this.retrieveCart(cartId)

        return { success: true }
      } catch (error: any) {
        this.error = error.message || 'Ürün sepetten çıkarılamadı'
        console.error('Error deleting line item:', error)
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async listShippingMethods() {
      const cartId = await this.getCartId()

      if (!cartId) {
        return []
      }

      this.isLoading = true
      this.error = null

      try {
        const client = useMedusaClient()
        const authToken = await this.getToken()
        
        const headers: Record<string, string> = {}
        if (authToken) {
          headers.Authorization = `Bearer ${authToken}`
        }

        // List shipping options for cart
        const response = await client.store.fulfillment.listCartOptions({ cart_id: cartId })
        this.shippingMethods = (response.shipping_options || []) as any[]
        return (response.shipping_options || []) as any[]
      } catch (error: any) {
        this.error = error.message || 'Kargo seçenekleri getirilemedi'
        console.error('Error listing shipping methods:', error)
        return []
      } finally {
        this.isLoading = false
      }
    },

    async setShippingMethod({
      cartId,
      shippingMethodId
    }: {
      cartId?: string
      shippingMethodId: string
    }) {
      const id = cartId || await this.getCartId()

      if (!id) {
        throw new Error('No cart ID found')
      }

      this.isLoading = true
      this.error = null

      try {
        const client = useMedusaClient()
        const authToken = await this.getToken()
        
        const headers: Record<string, string> = {}
        if (authToken) {
          headers.Authorization = `Bearer ${authToken}`
        }

        await client.store.cart.addShippingMethod(id, { option_id: shippingMethodId }, {}, headers)

        // Refresh cart after setting shipping method
        await this.retrieveCart(id)

        return { success: true }
      } catch (error: any) {
        this.error = error.message || 'Kargo yöntemi seçilemedi'
        console.error('Error setting shipping method:', error)
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async listPaymentMethods(regionId: string) {
      this.isLoading = true
      this.error = null

      try {
        const client = useMedusaClient()
        const authToken = await this.getToken()
        
        const headers: Record<string, string> = {}
        if (authToken) {
          headers.Authorization = `Bearer ${authToken}`
        }

        const response = await client.store.payment.listPaymentProviders(
          { region_id: regionId },
          headers
        )

        this.paymentMethods = response.payment_providers?.sort((a: any, b: any) => {
          return a.id > b.id ? 1 : -1
        }) || []
        
        return this.paymentMethods
      } catch (error: any) {
        this.error = error.message || 'Ödeme yöntemleri getirilemedi'
        console.error('Error listing payment methods:', error)
        return []
      } finally {
        this.isLoading = false
      }
    },

    async initiatePaymentSession(data: any) {
      if (!this.cart) {
        throw new Error('No cart found')
      }

      this.isLoading = true
      this.error = null

      try {
        const client = useMedusaClient()
        const authToken = await this.getToken()
        
        const headers: Record<string, string> = {}
        if (authToken) {
          headers.Authorization = `Bearer ${authToken}`
        }

        const response = await client.store.payment.initiatePaymentSession(this.cart as any, data, {}, headers)

        // Refresh cart after initiating payment session
        await this.retrieveCart(this.cart.id)

        return response
      } catch (error: any) {
        this.error = error.message || 'Ödeme oturumu başlatılamadı'
        console.error('Error initiating payment session:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async applyPromotions(codes: string[]) {
      const cartId = await this.getCartId()

      if (!cartId) {
        throw new Error('No cart ID found')
      }

      this.isLoading = true
      this.error = null

      try {
        const client = useMedusaClient()
        const authToken = await this.getToken()
        
        const headers: Record<string, string> = {}
        if (authToken) {
          headers.Authorization = `Bearer ${authToken}`
        }

        await client.store.cart.update(cartId, { promo_codes: codes }, {}, headers)

        // Refresh cart after applying promotions
        await this.retrieveCart(cartId)

        this.promotionFormState = {
          message: 'Promosyon kodu başarıyla uygulandı',
          type: 'success'
        }

        return { success: true }
      } catch (error: any) {
        this.error = error.message || 'Promosyon kodu uygulanamadı'
        this.promotionFormState = {
          message: this.error || 'Unknown error',
          type: 'error'
        }
        console.error('Error applying promotions:', error)
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async setAddresses(formData: {
      shipping_address: AddressFormData
      billing_address?: AddressFormData
      same_as_shipping?: boolean
    }) {
      const cartId = await this.getCartId()

      if (!cartId) {
        throw new Error('No cart ID found')
      }

      this.isLoading = true
      this.error = null

      try {
        const updateData: any = {
          shipping_address: formData.shipping_address
        }

        if (formData.same_as_shipping) {
          updateData.billing_address = formData.shipping_address
        } else if (formData.billing_address) {
          updateData.billing_address = formData.billing_address
        }

        await this.updateCart(updateData)

        return { success: true }
      } catch (error: any) {
        this.error = error.message || 'Adresler güncellenemedi'
        console.error('Error setting addresses:', error)
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async placeOrder(cartId?: string) {
      const id = cartId || await this.getCartId()

      if (!id) {
        throw new Error('No cart ID found')
      }

      this.isLoading = true
      this.error = null

      try {
        const client = useMedusaClient()
        const authToken = await this.getToken()
        
        const headers: Record<string, string> = {}
        if (authToken) {
          headers.Authorization = `Bearer ${authToken}`
        }

        const response = await client.store.cart.complete(id, {}, headers)

        // Clear cart after successful order
        this.cart = null
        await this.removeCartId()

        return response
      } catch (error: any) {
        this.error = error.message || 'Sipariş oluşturulamadı'
        console.error('Error placing order:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateRegion(countryCode: string, currentPath: string) {
      try {
        const cart = await this.getOrSetCart(countryCode)
        
        // You might want to redirect or update the current path here
        // This would depend on your routing setup
        
        return { success: true, cart }
      } catch (error: any) {
        this.error = error.message || 'Bölge güncellenemedi'
        console.error('Error updating region:', error)
        return { success: false, error: this.error }
      }
    },

    async transferCart() {
      const cartId = await this.getCartId()

      if (!cartId) {
        return
      }

      try {
        const client = useMedusaClient()
        const authToken = await this.getToken()
        
        if (!authToken) {
          return
        }

        const headers = {
          Authorization: `Bearer ${authToken}`
        }

        await client.store.cart.transferCart(cartId, {}, headers)

        // Refresh cart after transfer
        await this.retrieveCart(cartId)
      } catch (error: any) {
        console.error('Error transferring cart:', error)
      }
    },

    clearError() {
      this.error = null
    },

    clearPromotionFormState() {
      this.promotionFormState = null
    }
  }
})
