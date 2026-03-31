import api from '../instance'

export const getUsers = async (params) => {
  const response = await api.get(`/search-users?q=${params}`)
  return response.data
}
