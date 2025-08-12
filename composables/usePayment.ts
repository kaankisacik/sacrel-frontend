export const useInitiatePaymentSession = () => {
  const medusa = useMedusaClient()

  const loading = ref(false)
  const data = ref<any>()

  const mutate = async (cart: any, provider_id: string) => {
    loading.value = true

    try {
      // This would typically need a cart object, but we'll handle this in the implementation
      data.value = await medusa.store.payment.initiatePaymentSession(cart, {
        provider_id,
      })
    }
    catch (error) {
      console.error('Error initiating payment session:', error)
      throw error
    }
    finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    mutate,
  }
}
