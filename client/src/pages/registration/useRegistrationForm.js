import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { validationRules } from '../../components/validation-message/ValidationMessage'
import { registerUser } from '../../api/requests'

function useRegistrationForm() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [validationStatus, setValidationStatus] = useState({
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    confirmPassword: null,
  })

  const isFormValid =
    validationStatus.firstName === 'valid' &&
    validationStatus.lastName === 'valid' &&
    validationStatus.email === 'valid' &&
    validationStatus.password === 'valid' &&
    validationStatus.confirmPassword === 'valid'


  const handleBlur = e => {
    const { name, value } = e.target

    let isValid = false

    if (name === 'confirmPassword') {
      isValid = validationRules.confirmPassword(value, formData.password)
    } else if (validationRules[name]) {
      isValid = validationRules[name](value)
    }

    setValidationStatus(prev => ({
      ...prev,
      [name]: isValid ? 'valid' : 'invalid',
    }))
  }

  const handleRegistration = async e => {
    e.preventDefault()
    if (!isFormValid) return

    try {
      const data = await registerUser(formData)
      localStorage.setItem('token', data.token)
      navigate('/homepage')
      console.log('Registration successful')
    } catch (err) {
      console.error(err.message || 'Registration failed')
    }
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    setValidationStatus(prev => {
      const newStatus = { ...prev, [name]: null }

      if (name === 'password') {
        newStatus.confirmPassword = null
      }

      return newStatus
    })
  }

  return {
    formData,
    validationStatus,
    isFormValid,
    handleBlur,
    handleRegistration,
    handleChange,
  }
}

export { useRegistrationForm }