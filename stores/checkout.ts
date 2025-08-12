import { defineStore } from 'pinia'

interface CheckoutAddress {
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

interface CheckoutInfo {
  email: string
  shipping_address: CheckoutAddress
  billing_address?: CheckoutAddress | null
  use_same_address: boolean
}

interface ShippingOption {
  id: string
  name: string
  amount: number
  data?: any
}

interface PaymentSession {
  id: string
  provider_id: string
  amount: number
  status: string
  data: any
}

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    checkoutInfo: {
      email: '',
      shipping_address: {
        first_name: '',
        last_name: '',
        company: '',
        address_1: '',
        address_2: '',
        city: '',
        province: '',
        postal_code: '',
        country_code: 'TR',
        phone: ''
      },
      billing_address: null,
      use_same_address: true
    } as CheckoutInfo,
    selectedShippingOption: null as ShippingOption | null,
    selectedPaymentMethod: null as string | null,
    paymentSession: null as PaymentSession | null,
    isLoading: false,
    error: null as string | null,
    currentStep: 1,
    orderComplete: false,
    completedOrder: null as any
  }),

  getters: {
    isStepComplete: (state) => (step: number) => {
      switch (step) {
        case 1:
          return state.checkoutInfo.email.length > 0 &&
                 state.checkoutInfo.shipping_address.first_name.length > 0 &&
                 state.checkoutInfo.shipping_address.last_name.length > 0 &&
                 state.checkoutInfo.shipping_address.address_1.length > 0 &&
                 state.checkoutInfo.shipping_address.city.length > 0 &&
                 state.checkoutInfo.shipping_address.postal_code.length > 0 &&
                 state.checkoutInfo.shipping_address.country_code.length > 0
        case 2:
          return state.selectedShippingOption !== null
        case 3:
          return state.selectedPaymentMethod !== null
        default:
          return false
      }
    },

    formattedShippingAddress: (state) => {
      const addr = state.checkoutInfo.shipping_address
      return `${addr.first_name} ${addr.last_name}\n${addr.address_1}${addr.address_2 ? '\n' + addr.address_2 : ''}\n${addr.city}, ${addr.province} ${addr.postal_code}\n${addr.country_code.toUpperCase()}`
    },

    formattedBillingAddress: (state) => {
      if (state.checkoutInfo.use_same_address || !state.checkoutInfo.billing_address) {
        const addr = state.checkoutInfo.shipping_address
        return `${addr.first_name} ${addr.last_name}\n${addr.address_1}${addr.address_2 ? '\n' + addr.address_2 : ''}\n${addr.city}, ${addr.province} ${addr.postal_code}\n${addr.country_code.toUpperCase()}`
      }
      
      const addr = state.checkoutInfo.billing_address
      return `${addr.first_name} ${addr.last_name}\n${addr.address_1}${addr.address_2 ? '\n' + addr.address_2 : ''}\n${addr.city}, ${addr.province} ${addr.postal_code}\n${addr.country_code.toUpperCase()}`
    },

    isReadyForPayment: (state) => {
      // Check if step 1 is complete
      const step1Complete = state.checkoutInfo.email.length > 0 &&
                           state.checkoutInfo.shipping_address.first_name.length > 0 &&
                           state.checkoutInfo.shipping_address.last_name.length > 0 &&
                           state.checkoutInfo.shipping_address.address_1.length > 0 &&
                           state.checkoutInfo.shipping_address.city.length > 0 &&
                           state.checkoutInfo.shipping_address.postal_code.length > 0 &&
                           state.checkoutInfo.shipping_address.country_code.length > 0
      
      return step1Complete && 
             state.selectedShippingOption !== null && 
             state.selectedPaymentMethod !== null
    }
  },

  actions: {
    updateCustomerInfo(data: {
      email?: string
      shipping_address?: Partial<CheckoutAddress>
      billing_address?: Partial<CheckoutAddress>
      use_same_address?: boolean
    }) {
      if (data.email !== undefined) {
        this.checkoutInfo.email = data.email
      }

      if (data.shipping_address) {
        this.checkoutInfo.shipping_address = {
          ...this.checkoutInfo.shipping_address,
          ...data.shipping_address
        }
      }

      if (data.billing_address) {
        if (this.checkoutInfo.billing_address) {
          this.checkoutInfo.billing_address = {
            ...this.checkoutInfo.billing_address,
            ...data.billing_address
          }
        } else {
          this.checkoutInfo.billing_address = data.billing_address as CheckoutAddress
        }
      }

      if (data.use_same_address !== undefined) {
        this.checkoutInfo.use_same_address = data.use_same_address
        if (data.use_same_address) {
          this.checkoutInfo.billing_address = null
        }
      }
    },

    async submitAddresses() {
      this.isLoading = true
      this.error = null

      try {
        const cartStore = useCartStore()
        
        const addressData: any = {
          shipping_address: this.checkoutInfo.shipping_address,
          same_as_shipping: this.checkoutInfo.use_same_address
        }

        if (!this.checkoutInfo.use_same_address && this.checkoutInfo.billing_address) {
          addressData.billing_address = this.checkoutInfo.billing_address
        }

        // Update cart email if provided
        if (this.checkoutInfo.email) {
          await cartStore.updateCart({ email: this.checkoutInfo.email })
        }

        const result = await cartStore.setAddresses(addressData)
        
        if (result.success) {
          this.currentStep = Math.max(this.currentStep, 2)
          return { success: true }
        } else {
          throw new Error(result.error || 'Adresler kaydedilemedi')
        }
      } catch (error: any) {
        this.error = error.message || 'Adresler kaydedilemedi'
        console.error('Error submitting addresses:', error)
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async selectShippingOption(option: ShippingOption) {
      this.isLoading = true
      this.error = null

      try {
        const cartStore = useCartStore()
        
        const result = await cartStore.setShippingMethod({
          shippingMethodId: option.id
        })
        
        if (result.success) {
          this.selectedShippingOption = option
          this.currentStep = Math.max(this.currentStep, 3)
          return { success: true }
        } else {
          throw new Error(result.error || 'Kargo yöntemi seçilemedi')
        }
      } catch (error: any) {
        this.error = error.message || 'Kargo yöntemi seçilemedi'
        console.error('Error selecting shipping option:', error)
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async selectPaymentMethod(providerId: string) {
      this.isLoading = true
      this.error = null

      try {
        const cartStore = useCartStore()
        
        if (!cartStore.cart) {
          throw new Error('Sepet bulunamadı')
        }

        const paymentData = {
          provider_id: providerId
        }

        const result = await cartStore.initiatePaymentSession(paymentData)
        
        this.selectedPaymentMethod = providerId
        this.paymentSession = result as any
        
        return { success: true, paymentSession: result }
      } catch (error: any) {
        this.error = error.message || 'Ödeme yöntemi seçilemedi'
        console.error('Error selecting payment method:', error)
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    async completeOrder() {
      this.isLoading = true
      this.error = null

      try {
        const cartStore = useCartStore()
        
        if (!this.isReadyForPayment) {
          throw new Error('Sipariş tamamlanamıyor. Lütfen tüm bilgileri kontrol edin.')
        }

        const order = await cartStore.placeOrder()
        
        this.completedOrder = order
        this.orderComplete = true
        this.currentStep = 4
        
        // Reset checkout state for next order
        this.resetCheckout()
        
        return { success: true, order }
      } catch (error: any) {
        this.error = error.message || 'Sipariş tamamlanamadı'
        console.error('Error completing order:', error)
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    setCurrentStep(step: number) {
      this.currentStep = step
    },

    nextStep() {
      if (this.currentStep < 4) {
        this.currentStep++
      }
    },

    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },

    resetCheckout() {
      this.checkoutInfo = {
        email: '',
        shipping_address: {
          first_name: '',
          last_name: '',
          company: '',
          address_1: '',
          address_2: '',
          city: '',
          province: '',
          postal_code: '',
          country_code: 'TR',
          phone: ''
        },
        billing_address: null,
        use_same_address: true
      }
      this.selectedShippingOption = null
      this.selectedPaymentMethod = null
      this.paymentSession = null
      this.currentStep = 1
      this.error = null
    },

    async loadCustomerData() {
      const authStore = useAuthStore()
      
      if (authStore.isAuthenticated && authStore.customer) {
        this.checkoutInfo.email = authStore.customer.email
        
        if (authStore.primaryAddress) {
          const addr = authStore.primaryAddress
          this.checkoutInfo.shipping_address = {
            first_name: addr.first_name || '',
            last_name: addr.last_name || '',
            company: addr.company || '',
            address_1: addr.address_1,
            address_2: addr.address_2 || '',
            city: addr.city,
            province: addr.province,
            postal_code: addr.postal_code,
            country_code: addr.country_code,
            phone: addr.phone || ''
          }
        }
      }
    },

    clearError() {
      this.error = null
    }
  }
})
