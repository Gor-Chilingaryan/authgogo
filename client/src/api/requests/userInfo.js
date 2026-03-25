import api from '../instance'

export const getUserInfoRequest = async () => {
  try {
    const response = await api.get('/user-info')

    return response.data
  } catch (error) {
    const backendError = error.response?.data
    throw new Error(backendError?.message || 'You dont have access to this page')
  }

}

export const patchUserInfoRequest = async (userBody) => {
  try {
    const response = await api.patch('/user-info/changes', userBody)

    return response.data
  } catch (error) {
    const backendError = error.response?.data

    console.error('Update user info error:', backendError || error)

    throw new Error(backendError?.message || 'Update user info failed')

  }
}

export const logoutUserRequest = async () => {
  const response = await api.post('/logout')
  return response.data
}