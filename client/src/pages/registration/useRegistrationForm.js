import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { validationRules } from '../../components/validation-message/ValidationMessage'
import { registerUser } from '../../api/requests/auth'

function useRegistrationForm() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/homepage', { replace: true })
    }
  }, [navigate])

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

  const [serverError, setServerError] = useState(null)


  const isFormValid = Object.values(validationStatus).every(status => status === 'valid')

  const validateForm = () => {
    const statuses = {
      firstName: validationRules.firstName(formData.firstName) ? 'valid' : 'invalid',
      lastName: validationRules.lastName(formData.lastName) ? 'valid' : 'invalid',
      email: validationRules.email(formData.email) ? 'valid' : 'invalid',
      password: validationRules.password(formData.password) ? 'valid' : 'invalid',
      confirmPassword: validationRules.confirmPassword(formData.confirmPassword, formData.password) ? 'valid' : 'invalid',
    }
    setValidationStatus(statuses)

    return Object.values(statuses).every(status => status === 'valid')
  }

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

    const isValid = validateForm()

    if (!isValid) return

    try {
      const { confirmPassword, ...registerData } = formData
      const data = await registerUser(registerData)

      localStorage.setItem('token', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('isLogged', 'true')

      navigate('/homepage')
    } catch (err) {
      setServerError(err.message || 'Registration failed')
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

    if (serverError) setServerError(null)
  }

  return {
    formData,
    validationStatus,
    isFormValid,
    handleBlur,
    handleRegistration,
    handleChange,
    serverError,
  }
}

export { useRegistrationForm }