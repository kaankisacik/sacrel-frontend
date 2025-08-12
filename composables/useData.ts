export const useFetchCountries = () => {
  const medusa = useMedusaClient()
  
  return useLazyAsyncData('countries', async () => {
    try {
      const { regions } = await medusa.store.region.list()
      return { regions: regions || [] }
    } catch (error: any) {
      console.error('Error fetching regions:', error)
      return { regions: [] }
    }
  })
}

export const useData = () => {
  const medusa = useMedusaClient()

  const getRegion = async (countryCode: string) => {
    try {
      const { regions } = await medusa.store.region.list()
      
      if (!regions) {
        return null
      }

      // Find region that contains the country code
      const region = regions.find(region => 
        region.countries?.some(country => country.iso_2 === countryCode)
      )

      return region || regions.find(region => 
        region.countries?.some(country => country.iso_2 === 'us')
      )
    } catch (error: any) {
      console.error('Error getting region:', error)
      return null
    }
  }

  const listRegions = async () => {
    try {
      const { regions } = await medusa.store.region.list()
      return regions || []
    } catch (error: any) {
      console.error('Error listing regions:', error)
      return []
    }
  }

  const retrieveRegion = async (id: string) => {
    try {
      const { region } = await medusa.store.region.retrieve(id)
      return region
    } catch (error: any) {
      console.error('Error retrieving region:', error)
      return null
    }
  }

  return {
    getRegion,
    listRegions,
    retrieveRegion
  }
}

export const useFetchOrder = (orderId: string) => {
  const medusa = useMedusaClient()

  return useLazyAsyncData(
    `order:${orderId}`,
    async () => await medusa.store.order.retrieve(orderId, {
      fields: '*payment_collections.payments,*items,*items.metadata,*items.variant,*items.product',
    }),
    {
      transform: data => data.order,
    },
  )
}

export const useFetchShippingOptions = () => {
  const medusa = useMedusaClient()

  return useLazyAsyncData(
    `shipping-options`,
    async () => {      
      try {
        const { shipping_options } = await medusa.store.fulfillment.listCartOptions()
        return { shipping_options }
      } catch (error) {
        console.error('Error fetching shipping options:', error)
        return { shipping_options: [] }
      }
    },
    {},
  )
}

export const useFetchPaymentProviders = () => {
  const medusa = useMedusaClient()

  return useLazyAsyncData(
    `payment-providers`,
    async () => {
      try {
        const { payment_providers } = await medusa.store.payment.listPaymentProviders()
        return { payment_providers }
      } catch (error) {
        console.error('Error fetching payment providers:', error)
        return { payment_providers: [] }
      }
    },
    {},
  )
}

export const usePaymentSession = () => {
  const medusa = useMedusaClient()

  const initiatePaymentSession = async (cart: any, provider_id: string) => {
    try {
      // Note: This may need adjustment based on the actual Medusa client API
      const response = await medusa.store.payment.initiatePaymentSession(cart, {
        provider_id,
      })
      return response.payment_collection
    } catch (error) {
      console.error('Error initiating payment session:', error)
      throw error
    }
  }

  return {
    initiatePaymentSession,
  }
}
