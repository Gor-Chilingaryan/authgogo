import api from '@api/instance'

export const getUserInfoRequest = async () => {
  try {
    const response = await api.get('/user-info')

    return response.data
  } catch (error) {
    throw new Error('You dont have access to this page')
  }
}

export const patchUserInfoRequest = async (userBody) => {

  try {
    const response = await api.patch('/user-info/changes', userBody)

    return response.data
  } catch (error) {
    throw new Error('Update user info failed')
  }
}


export const logoutUserRequest = async () => {
  const response = await api.post('/logout')
  return response.data
}

export const uploadImageRequest = async (formData) => {
  try {
    const response = await api.post('/upload-avatar',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      }
    )

    return response.data
  } catch (error) {
    console.error('Upload image failed')
  }
}