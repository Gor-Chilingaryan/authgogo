import api from '@api/instance'

const formatApiError = (fallbackMessage, error) => {
  const serverMessage = error?.response?.data?.message
  const message = serverMessage || error?.message || fallbackMessage
  return new Error(message)
}

export const getNavigationItems = async () => {
  try {
    const response = await api.get('/nav-items')
    return response.data
  } catch (error) {
    console.error('[API] getNavigationItems failed', error?.response?.data || error)
    throw formatApiError('Failed to get all navigation', error)
  }
}

export const createNavigationItem = async (item) => {
  try {
    const response = await api.post('/nav-item', item)
    return response.data
  } catch (error) {
    console.error('[API] createNavigationItem failed', error?.response?.data || error)
    throw formatApiError('Failed to create navigation item', error)
  }
}

export const deleteNavigationItem = async (id) => {
  try {
    const response = await api.delete(`/nav-item/${id}`)
    return response.data
  } catch (error) {
    console.error('[API] deleteNavigationItem failed', error?.response?.data || error)
    throw formatApiError('Failed to delete navigation item', error)
  }
}
export const reorderNavigationTree = async (items) => {
  try {
    console.debug('[API] reorderNavigationTree request', { items })
    const response = await api.patch('/update-tree', { items })
    console.debug('[API] reorderNavigationTree response', response.data)
    return response.data
  } catch (error) {
    console.error('[API] reorderNavigationTree failed', error?.response?.data || error)
    throw formatApiError('Failed to reorder navigation tree', error)
  }
}

