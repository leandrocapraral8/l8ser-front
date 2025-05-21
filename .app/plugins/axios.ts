import { defineNuxtPlugin } from '#app'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { isTokenExpired } from '~/utils/auth.js'

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()

  const axiosInstance = axios.create({
    // baseURL: 'http://10.61.61.201:8006',
    baseURL: 'http://localhost:8006',
  })

  // Interceptador para adicionar o token JWT
  axiosInstance.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('jwt_token')

      // Verifica se o token existe e se não está expirado
      if (token && !isTokenExpired() && config.url !== '/login/') {
        config.headers.Authorization = `Bearer ${token}`
      }
      else if (token && isTokenExpired()) {
        // Se o token estiver expirado, remove-o do localStorage e redireciona para a página de login
        localStorage.removeItem('jwt_token')
        localStorage.removeItem('user_first_name')
        localStorage.removeItem('user_last_name')
        localStorage.removeItem('user_email')
        router.push('/login')
      }
    }

    return config
  })

  // Interceptador de resposta para tratar erros globalmente
  axiosInstance.interceptors.response.use(
    response => response,
    (error) => {
      // Tratar erros de autenticação
      if (error.response?.status === 401) {
        // Redireciona para a página de login caso o erro seja 401 (não autorizado)
        router.push('/login')
      }
      return Promise.reject(error)
    },
  )

  return {
    provide: {
      axios: axiosInstance,
    },
  }
})
