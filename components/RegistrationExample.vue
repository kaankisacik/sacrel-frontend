<template>
  <div class="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-6 text-center">Register Example</h2>
    
    <form @submit.prevent="handleRegistration" class="space-y-4">
      <div v-if="error" class="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ error }}
      </div>
      
      <div v-if="success" class="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
        Registration successful! Customer created: {{ customer?.email }}
      </div>
      
      <div>
        <input
          v-model="firstName"
          type="text"
          placeholder="First Name"
          required
          class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <input
          v-model="lastName"
          type="text"
          placeholder="Last Name"
          required
          class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
          class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
          class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <button
        type="submit"
        :disabled="loading || !isFormValid"
        class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="loading">Registering...</span>
        <span v-else>Register</span>
      </button>
    </form>
    
    <div v-if="debugInfo" class="mt-4 p-3 bg-gray-100 rounded text-sm">
      <h3 class="font-semibold">Debug Info:</h3>
      <pre>{{ debugInfo }}</pre>
    </div>
  </div>
</template>

<script setup>
/**
 * Registration Example Component
 * 
 * This component demonstrates the improved registration flow according to 
 * the Medusa documentation. It follows these steps:
 * 
 * 1. Try to obtain a registration JWT token
 * 2. If email already exists, try to login with the same credentials
 * 3. Create the customer using the authentication token
 * 
 * This allows admin users or other actor types to also register as customers
 * if they have the same email and password.
 */

const loading = ref(false)
const firstName = ref("")
const lastName = ref("")
const email = ref("")
const password = ref("")
const error = ref("")
const success = ref(false)
const customer = ref(null)
const debugInfo = ref("")

const isFormValid = computed(() => {
  return firstName.value && lastName.value && email.value && password.value
})

const handleRegistration = async () => {
  if (!isFormValid.value) return
  
  loading.value = true
  error.value = ""
  success.value = false
  debugInfo.value = ""
  
  try {
    const client = useMedusaClient()
    
    // Step 1: Try to obtain registration JWT token
    debugInfo.value += "Step 1: Attempting registration...\n"
    
    try {
      await client.auth.register("customer", "emailpass", {
        email: email.value,
        password: password.value,
      })
      debugInfo.value += "✓ Registration token obtained successfully\n"
    } catch (registrationError) {
      debugInfo.value += `Registration error: ${registrationError.message}\n`
      
      // Check if the error is about existing identity
      if (
        registrationError?.response?.status === 401 || 
        registrationError?.message?.includes("Identity with email already exists") ||
        registrationError?.statusText === "Unauthorized"
      ) {
        debugInfo.value += "Step 2: Identity exists, attempting login...\n"
        
        // Try to login with the same credentials
        const loginResponse = await client.auth.login("customer", "emailpass", {
          email: email.value,
          password: password.value,
        })

        if (typeof loginResponse !== "string") {
          throw new Error("Authentication requires additional steps which is not supported by this flow")
        }
        
        debugInfo.value += "✓ Login successful with existing identity\n"
      } else {
        // For other registration errors, throw them
        throw registrationError
      }
    }

    // Step 3: Create the customer using the authentication token
    debugInfo.value += "Step 3: Creating customer...\n"
    
    const { customer: newCustomer } = await client.store.customer.create({
      first_name: firstName.value,
      last_name: lastName.value,
      email: email.value,
    })

    customer.value = newCustomer
    success.value = true
    debugInfo.value += "✓ Customer created successfully\n"
    
    console.log("Customer registered:", newCustomer)
    
  } catch (err) {
    console.error("Registration error:", err)
    error.value = `Registration failed: ${err.message}`
    debugInfo.value += `✗ Error: ${err.message}\n`
  } finally {
    loading.value = false
  }
}
</script>
