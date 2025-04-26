export default defineNuxtRouteMiddleware((to, from) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('jwt_token')

    if (to.path === '/login') {
      return
    }

    if (!token && token === undefined && token === null) {
      return navigateTo('/login')
    }
  }
})
