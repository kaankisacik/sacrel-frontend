import { useAuthStore } from '~/stores/auth'

export const useAuth = () => {
  const authStore = useAuthStore()
  
  // Initialize auth on first load
  if (process.client && !authStore.customer) {
    authStore.init()
  }
  
  const login = async (email: string, password: string) => {
    return await authStore.login(email, password)
  }
  
  const register = async (userData: {
    first_name: string
    last_name: string
    email: string
    password: string
    phone?: string
  }) => {
    return await authStore.register(userData)
  }
  
  const logout = async () => {
    await authStore.logout()
  }
  
  const updateProfile = async (data: {
    first_name?: string
    last_name?: string
    phone?: string
  }) => {
    return await authStore.updateCustomer(data)
  }
  
  const getOrders = async () => {
    return await authStore.getOrders()
  }
  
  const addAddress = async (addressData: any) => {
    return await authStore.addAddress(addressData)
  }
  
  const updateAddress = async (addressId: string, addressData: any) => {
    return await authStore.updateAddress(addressId, addressData)
  }
  
  const deleteAddress = async (addressId: string) => {
    return await authStore.deleteAddress(addressId)
  }
  
  return {
    // State
    customer: readonly(toRef(authStore, 'customer')),
    addresses: readonly(toRef(authStore, 'addresses')),
    isLoading: readonly(toRef(authStore, 'isLoading')),
    error: readonly(toRef(authStore, 'error')),
    isAuthenticated: readonly(toRef(authStore, 'isAuthenticated')),
    fullName: computed(() => authStore.fullName),
    primaryAddress: computed(() => authStore.primaryAddress),
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    getOrders,
    addAddress,
    updateAddress,
    deleteAddress,
    clearError: () => authStore.clearError()
  }
}
