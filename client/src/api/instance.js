import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
})


instance.interceptors.request.use((config) => {
  return config
})

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    const isRefreshRequest =
      typeof originalRequest?.url === 'string' &&
      originalRequest.url.includes('/refresh')

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshRequest) {
      originalRequest._retry = true

      try {
        await instance.post('/refresh')

        return instance(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('isLogged')

        if (window.location.pathname !== '/') {
          window.location.href = '/'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default instance