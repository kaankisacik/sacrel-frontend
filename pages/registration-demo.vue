<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-4">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          Medusa Registration Flow Demo
        </h1>
        <p class="text-gray-600">
          This page demonstrates the improved customer registration flow according to the Medusa documentation.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Registration Example Component -->
        <div>
          <h2 class="text-xl font-semibold mb-4">Live Registration Example</h2>
          <RegistrationExample />
        </div>

        <!-- Documentation Summary -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Registration Flow</h2>
          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">1</span>
              <div>
                <h3 class="font-medium">Try Registration</h3>
                <p class="text-sm text-gray-600">Send POST to <code>/auth/customer/emailpass/register</code> to obtain registration JWT token.</p>
              </div>
            </div>
            
            <div class="flex items-start space-x-3">
              <span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">2</span>
              <div>
                <h3 class="font-medium">Handle Existing Identity</h3>
                <p class="text-sm text-gray-600">If "Identity with email already exists" error occurs, try login with <code>/auth/customer/emailpass</code>.</p>
              </div>
            </div>
            
            <div class="flex items-start space-x-3">
              <span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">3</span>
              <div>
                <h3 class="font-medium">Create Customer</h3>
                <p class="text-sm text-gray-600">Send request to <code>/store/customers</code> using the JWT token to create customer.</p>
              </div>
            </div>
          </div>

          <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h4 class="font-medium text-yellow-800 mb-2">Important Notes:</h4>
            <ul class="text-sm text-yellow-700 space-y-1">
              <li>• This flow allows admin users to also become customers</li>
              <li>• The JS SDK automatically handles JWT tokens</li>
              <li>• Existing identities with different passwords will fail</li>
              <li>• Multi-step authentication is not supported in this flow</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Store Integration Example -->
      <div class="mt-8 bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Store Integration</h2>
        <p class="text-gray-600 mb-4">
          Your main registration flow is handled by the auth store. Here's how it works:
        </p>
        
        <div class="bg-gray-50 rounded p-4">
          <h3 class="font-medium mb-2">useAuthStore().register()</h3>
          <p class="text-sm text-gray-600">
            The register action in your auth store now follows the improved flow and handles:
          </p>
          <ul class="text-sm text-gray-600 mt-2 space-y-1">
            <li>• Registration with new emails</li>
            <li>• Existing identity scenarios</li>
            <li>• Automatic customer creation</li>
            <li>• Error handling with Turkish messages</li>
            <li>• Authentication state management</li>
          </ul>
        </div>

        <div class="mt-4 flex space-x-4">
          <NuxtLink
            to="/register"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Test Real Registration Page
          </NuxtLink>
          <NuxtLink
            to="/login"
            class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Test Login Page
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Registration Demo'
})
</script>
