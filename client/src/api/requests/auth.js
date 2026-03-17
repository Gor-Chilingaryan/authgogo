import api from '../instance'

export const loginUser = async (userData) => {
  try {
    const response = await api.post('/login', userData)

    return response.data
  } catch (error) {
    const backendError = error.response?.data
    console.error('Login error:', backendError || error)


    throw new Error(backendError?.message || 'Login failed')
  }
}

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/registration', userData)

    return response.data
  } catch (error) {
    const backendError = error.response?.data
    console.error('Registration error:', backendError || error)

    throw new Error(backendError?.message || 'Registration failed')
  }
}

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/forgot-password', { email })
    console.log(response.data)
    return response.data
  } catch (error) {
    const backendError = error.response?.data
    console.error('Forgot password error:', backendError || error)

    throw new Error(backendError?.message || 'Forgot password failed')
  }

}

export const newPassword = async (email, password) => {
  try {
    const response = await api.patch('/new-password', { email, password })

    return response.data
  } catch (error) {
    const backendError = error.response?.data

    console.error('Update password erroe:',backendError || error)

    throw new Error(backendError?.message || 'Update password failed')
  }
}