import api from '../instance'

export const loginUser = async (userData) => {
  try {
    const response = await api.post('/login', userData)

    return response.data
  } catch (error) {


    throw new Error('Login failed')
  }
}

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/registration', userData)

    return response.data
  } catch (error) {

    throw new Error('Registration failed')
  }
}

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/forgot-password', { email })
    console.log(response.data)
    return response.data
  } catch (error) {
    throw new Error('Forgot password failed')
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

