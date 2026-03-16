import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { newPassword } from '../../api/requests'
import { validationRules } from '../../components/validation-message/ValidationMessage'


function useNewPassword() {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password')
    }
  }, [email, navigate])

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [validationStatus, setValidationStatus] = useState({
    password: null,
    confirmPassword: null,
  })
  const [serverError, setServerError] = useState(null)
  const isFormValid = validationStatus.password === 'valid'
    && validationStatus.confirmPassword === 'valid'

  const handleChange = e => {
    const { name, value } = e.target

    setFormData(prev => ({ ...prev, [name]: value }))
    setValidationStatus(prev => ({ ...prev, [name]: null }))
  }

  const handleBlur = e => {
    const { name, value } = e.target
    let isValid = false


    if (name === 'confirmPassword') {
      isValid = value === formData.password && value.length > 0
    } else if (validationRules[name]) {
      isValid = validationRules[name](value)
    }

    setValidationStatus(prev => ({
      ...prev,
      [name]: isValid ? 'valid' : 'invalid'
    }))
  }

  const handleSavePassword = async e => {
    e.preventDefault()
    if (!isFormValid || !email) return

    setServerError(null)

    try {
      const data = await newPassword(email, formData.password)

      localStorage.setItem('token', data.token)

      console.log(data.message)

      navigate('/homepage')
    } catch (err) {
      setServerError(err.message || 'An error occurred')
    }

  }

  return {
    formData,
    validationStatus,
    isFormValid,
    handleBlur,
    handleChange,
    handleSavePassword,
    serverError
  }
}

export default useNewPassword