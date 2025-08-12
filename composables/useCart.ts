export const useUserCart = () => {
  const cartIdCookie = useCookie('cart_id', {
    maxAge: 60 * 60 * 24 * 90,
  })

  const setCartId = (cartId?: string) => {
    if (!cartId) {
      cartIdCookie.value = null
      return
    }
    cartIdCookie.value = cartId
  }

  return {
    cartId: computed(() => cartIdCookie.value || undefined),
    setCartId,
  }
}

export const useCartDropdown = () => {
  const route = useRoute()
  const isCartDropdownOpen = useState('cart-dropdown', () => false)

  watch(route, (newRoute) => {
    if (newRoute.path.includes('cart'))
      isCartDropdownOpen.value = false
  })

  return {
    isCartDropdownOpen,
  }
}

export const useFetchCart = async () => {
  const { retrieveCart } = useCart()

  return useLazyAsyncData(
    'cart',
    async () => await retrieveCart(),
  )
}

export const useAddToCart = () => {
  const { updateOrCreateLineItem } = useCart()

  const loading = ref(false)
  const data = ref<any>()

  const mutate = async (item: any) => {
    loading.value = true

    try {
      data.value = await updateOrCreateLineItem(item)
    }
    catch (error) {
      console.error('Error updating cart:', error)
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

export const useUpdateCart = () => {
  const { updateCart } = useCart()

  const loading = ref(false)
  const data = ref<any>()

  const mutate = async (dataToUpdate: any) => {
    loading.value = true

    try {
      data.value = await updateCart(dataToUpdate)
    }
    catch (error) {
      console.error('Error updating cart:', error)
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

export const useUpdateLineItem = () => {
  const { updateLineItem } = useCart()

  const loading = ref(false)
  const data = ref<any>()

  const mutate = async (itemId: string, dataToUpdate: any) => {
    loading.value = true

    try {
      data.value = await updateLineItem(itemId, dataToUpdate)
    }
    catch (error) {
      console.error('Error updating line item:', error)
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

export const useDeleteLineItem = () => {
  const { deleteLineItem } = useCart()

  const loading = ref(false)
  const data = ref<boolean>()

  const mutate = async (itemId: string) => {
    loading.value = true

    try {
      data.value = await deleteLineItem(itemId)
    }
    catch (error) {
      console.error('Error deleting line item:', error)
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

export const useSetShippingMethod = () => {
  const { addShippingMethod } = useCart()

  const loading = ref(false)
  const data = ref<any>()

  const mutate = async (shippingMethodId: string) => {
    loading.value = true

    try {
      data.value = await addShippingMethod(shippingMethodId)
    }
    catch (error) {
      console.error('Error setting shipping method:', error)
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

export const usePlaceOrder = () => {
  const { completeOrder } = useCart()
  const { setCartId } = useUserCart()

  const loading = ref(false)
  const data = ref<any>()

  const mutate = async () => {
    loading.value = true

    try {
      const orderResponse = await completeOrder()
      if (orderResponse.type === 'order') {
        setCartId()
        refreshNuxtData(`cart`)
        data.value = orderResponse.order
        navigateTo(`/order/${orderResponse.order.id}/confirmed`)
      }
      else {
        data.value = orderResponse.cart
      }
    }
    catch (error) {
      console.error('Error placing order:', error)
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

export const useCart = () => {
  const medusa = useMedusaClient()
  const { cartId, setCartId } = useUserCart()

  const retrieveCart = async () => {
    if (!cartId.value) {
      return await createCart()
    }

    try {
      const cartResponse = await medusa.store.cart.retrieve(cartId.value, {
        fields: '*items,*region,*items.product,*items.variant,*items.thumbnail,*items.metadata,+items.total,*promotions,+shipping_methods.name',
      })
      return cartResponse
    } catch (error) {
      console.error('Error retrieving cart:', error)
      return await createCart()
    }
  }

  const createCart = async () => {
    try {
      const cartResponse = await medusa.store.cart.create({})
      setCartId(cartResponse.cart.id)
      return cartResponse
    } catch (error) {
      console.error('Error creating cart:', error)
      throw error
    }
  }

  const retrieveOrCreateCart = async () => {
    return await retrieveCart()
  }

  const updateCart = async (data: any) => {
    if (!cartId.value) throw new Error('No cart found')
    
    try {
      const cartResponse = await medusa.store.cart.update(cartId.value, data)
      return cartResponse.cart
    } catch (error) {
      console.error('Error updating cart:', error)
      throw error
    }
  }

  const createLineItem = async (item: any) => {
    const cart = await retrieveOrCreateCart()
    
    try {
      const cartResponse = await medusa.store.cart.createLineItem(cart.cart.id, item)
      return cartResponse.cart
    } catch (error) {
      console.error('Error creating line item:', error)
      throw error
    }
  }

  const updateLineItem = async (lineItemId: string, data: any) => {
    if (!cartId.value) throw new Error('No cart found')
    
    try {
      const cartResponse = await medusa.store.cart.updateLineItem(cartId.value, lineItemId, data)
      return cartResponse.cart
    } catch (error) {
      console.error('Error updating line item:', error)
      throw error
    }
  }

  const updateOrCreateLineItem = async (item: any) => {
    return await createLineItem(item)
  }

  const deleteLineItem = async (lineItemId: string) => {
    if (!cartId.value) throw new Error('No cart found')
    
    try {
      await medusa.store.cart.deleteLineItem(cartId.value, lineItemId)
      return true
    } catch (error) {
      console.error('Error deleting line item:', error)
      throw error
    }
  }

  const addShippingMethod = async (shippingMethodId: string) => {
    if (!cartId.value) throw new Error('No cart found')
    
    try {
      const cartResponse = await medusa.store.cart.addShippingMethod(cartId.value, { option_id: shippingMethodId })
      return cartResponse.cart
    } catch (error) {
      console.error('Error adding shipping method:', error)
      throw error
    }
  }

  const completeOrder = async () => {
    if (!cartId.value) throw new Error('No cart found')
    
    try {
      const response = await medusa.store.cart.complete(cartId.value)
      return response
    } catch (error) {
      console.error('Error completing order:', error)
      throw error
    }
  }

  return {
    retrieveCart,
    createCart,
    retrieveOrCreateCart,
    updateCart,
    createLineItem,
    updateLineItem,
    updateOrCreateLineItem,
    deleteLineItem,
    addShippingMethod,
    completeOrder,
  }
}
