import api from './instance'


export const loginUser = async (userData) => {
  try {
    const response = await api.post('/login', userData)

    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Network error' }
  }
}