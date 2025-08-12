// Types
export interface Customer {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  created_at: string
  updated_at: string
  has_account: boolean
}

export interface CustomerResponse {
  customer: Customer | null
}

export interface RegisterCustomerData {
  first_name: string
  last_name: string
  email: string
  password: string
  phone?: string
}

export interface LoginCustomerData {
  email: string
  password: string
}

export interface UpdateCustomerData {
  first_name?: string
  last_name?: string
  email?: string
  password?: string
  phone?: string
}

/**
 * Customer data fetching with Medusa client
 */
export const useFetchCustomer = () => {
  const medusa = useMedusaClient()
  
  return useLazyAsyncData('customer', async () => {
    try {
      const { customer } = await medusa.store.customer.retrieve()
      return { customer }
    } catch (error: any) {
      // Customer not authenticated
      return { customer: null }
    }
  })
}

/**
 * Customer actions management (auth, profile)
 */
export const useCustomer = () => {
  const medusa = useMedusaClient()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Customer data
  const { data: customerData, refresh: refreshCustomer } = useFetchCustomer()

  const customer = computed(() => customerData.value?.customer || null)
  const isAuthenticated = computed(() => !!customerData.value?.customer)

  // Registration
  const register = async (data: RegisterCustomerData) => {
    error.value = null
    isLoading.value = true

    try {
      await medusa.auth.register("customer", "emailpass", data)
      
      // After registration, log in the user
      await login({ email: data.email, password: data.password })
      
      return { success: true }
    }
    catch (err: unknown) {
      const errorResponse = err as { message?: string }

      if (errorResponse.message) {
        error.value = errorResponse.message
      } else {
        error.value = 'An error occurred during registration'
      }
      
      return { success: false, error: error.value }
    }
    finally {
      isLoading.value = false
    }
  }

  // Login
  const login = async (data: LoginCustomerData) => {
    error.value = null
    isLoading.value = true

    try {
      const result = await medusa.auth.login("customer", "emailpass", {
        email: data.email,
        password: data.password,
      })

      if (typeof result !== "string") {
        // Handle redirect case if needed
        error.value = "Authentication requires additional steps"
        return { success: false, error: error.value }
      }

      await refreshCustomer()
      return { success: true }
    }
    catch (err: unknown) {
      const errorResponse = err as { message?: string }

      if (errorResponse.message) {
        error.value = errorResponse.message
      } else {
        error.value = 'Invalid email or password'
      }
      
      return { success: false, error: error.value }
    }
    finally {
      isLoading.value = false
    }
  }

  // Logout
  const logout = async () => {
    error.value = null
    isLoading.value = true

    try {
      await medusa.auth.logout()
      await refreshCustomer()
    }
    catch (err: unknown) {
      // Silence error for logout
      console.warn('Logout error:', err)
    }
    finally {
      isLoading.value = false
    }
  }

  // Profile update
  const updateCustomer = async (data: UpdateCustomerData) => {
    error.value = null
    isLoading.value = true

    try {
      const { customer: updatedCustomer } = await medusa.store.customer.update(data)
      
      await refreshCustomer()
      return { success: true, customer: updatedCustomer }
    }
    catch (err: unknown) {
      const errorResponse = err as { message?: string }

      if (errorResponse.message) {
        error.value = errorResponse.message
      } else {
        error.value = 'An error occurred while updating your profile'
      }
      
      return { success: false, error: error.value }
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    customer,
    isAuthenticated,
    isLoading,
    error,
    register,
    login,
    logout,
    updateCustomer,
  }
}
