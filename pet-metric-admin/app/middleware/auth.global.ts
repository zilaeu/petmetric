export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return
  const { token } = useAdminAuth()
  if (!token.value && to.path !== '/login') return navigateTo('/login')
  if (token.value && to.path === '/login') return navigateTo('/')
})
