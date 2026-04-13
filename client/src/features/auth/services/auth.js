import api from '@api/instance'

export const loginUser = async (userData) => {
  try {
    const response = await api.post('/login', userData)

    return response.data
  } catch (error) {
    throw new Error(error.message || 'Login failed')
  }
}

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/registration', userData)

    return response.data
  } catch (error) {
    throw new Error(error.message || 'Registration failed')
  }
}

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/forgot-password', { email })

    return response.data
  } catch (error) {
    throw new Error(error.message || 'Forgot password failed')
  }

}

export const newPassword = async (email, password) => {
  try {
    const response = await api.patch('/new-password', { email, password })

    return response.data
  } catch (error) {
    throw new Error('Update password failed')
  }
}

