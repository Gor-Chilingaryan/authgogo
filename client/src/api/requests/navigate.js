import api from '../instance'

export const getAllNavigation = async () => {
  try {
    const response = await api.get('/home-navigation-all', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    return response.data
  } catch (error) {
    const backendError = error.response?.data
    console.error('Failed to get all navigation:', backendError || error.message)
    throw new Error(backendError?.message || 'Failed to get all navigation')
  }
}
