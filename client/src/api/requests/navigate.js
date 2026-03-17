import api from '../instance'

export const getAllNavigation = async () => {
  try {
    const response = await api.get('/home-navigation-all')
    return response.data
  } catch (error) {
    console.error('Get all navigation error:', error)
    throw new Error(error.message || 'Failed to get all navigation')
  }
}
