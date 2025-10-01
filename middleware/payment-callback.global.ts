/**
 * Catch-all route for callback URLs
 * iyzico bazen farklı slug'larla callback gönderebilir
 */
export default defineNuxtRouteMiddleware((to) => {
  // Eğer /payment/callback/ ile başlayan herhangi bir route gelirse
  // result sayfasına yönlendir
  if (to.path.startsWith('/payment/callback/') && to.path !== '/payment/callback/result') {
    return navigateTo({
      path: '/payment/callback/result',
      query: to.query
    });
  }
});