export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  authStore.checkAuth();

  if (!authStore.isAuthenticated && to.path !== "/login") {
    return navigateTo("/login");
  }
});
