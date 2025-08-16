export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();

  
  
  // If route doesn't exist, go to home
  if (to.name === null || to.name === undefined) {
    return navigateTo("/");
  }

  // If user is authenticated and trying to access auth pages, redirect to home
  if (to.path.startsWith("/auth") && authStore.isUserAuthenticated) {
    return navigateTo("/");
  }

  // If user is NOT authenticated and trying to access protected routes, redirect to login
  if (to.path.startsWith("/profile") && !authStore.isUserAuthenticated) {
    if (import.meta.client && utils.isJwtTokenExpired(localStorage.getItem("medusa_auth_token") || "")) {
      return navigateTo("/auth/login");
    }
  }
});