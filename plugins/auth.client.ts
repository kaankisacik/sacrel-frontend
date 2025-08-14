export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  
  // Initialize auth state early in the client
  if (process.client) {
    await authStore.init()
  }
})
