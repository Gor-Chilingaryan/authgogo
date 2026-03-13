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
