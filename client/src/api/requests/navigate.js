import api from '../instance'

export const getAllNavigation = async () => {
  try {
    const response = await api.get('/home-navigation-all')

    return response.data
  } catch (error) {

    throw new Error('Failed to get all navigation')
  }
}
export const createNavigationItem = async (item) => {
  try {
    const response = await api.post('/home-navigation-create', item)

    return response.data

  } catch (error) {
    throw new Error('Failed to create navigation item')
  }
}

export const updateNavigationItem = async (newOrder) => {
  try {
    const response = await api.patch('/update-order', { newOrder })

    return response.data
  } catch (error) {

    throw new Error('Failed to update navigation item')
  }
}

export const deleteNavigationItem = async (id) => {
  try {
    const response = await api.delete(`/home-navigation/${id}`)

    return response.data
  } catch (error) {

    throw new Error('Failed to delete navigation item')
  }
}

export const createChildNavigation = async (id, data) => {
  try {
    const response = await api.post(`/home-navigation/${id}/child`, data)

    return response.data
  } catch (error) {

    throw new Error('Failed to add child navigation')
  }
}

export const deleteChildNavigation = async (parentId, childId) => {
  try {
    const response = await api.delete(`/home-navigation/${parentId}/child/${childId}`)

    return response.data
  } catch (error) {

    throw new Error('Failed to delete child navigation')
  }
}