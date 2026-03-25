import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { newPassword } from '../../api/requests/auth'
import { validationRules } from '../../components/validation-message/ValidationMessage'


function useNewPassword() {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/homepage', { replace: true })
    }
  }, [navigate])

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })

  const [validationStatus, setValidationStatus] = useState({
    password: null,
    confirmPassword: null,
  })

  const [serverError, setServerError] = useState(null)


  const validateForm = () => {
    const statuses = {
      password: validationRules.password(formData.password) ? 'valid' : 'invalid',
      confirmPassword: validationRules.confirmPassword(formData.confirmPassword, formData.password) ? 'valid' : 'invalid',
    }
    setValidationStatus(statuses)
    return statuses.password === 'valid' && statuses.confirmPassword === 'valid'
  }



  useEffect(() => {
    if (!email) {
      navigate('/forgot-password')
    }
  }, [email, navigate])



  const isFormValid = validationStatus.password === 'valid'
    && validationStatus.confirmPassword === 'valid'

  const handleChange = e => {
    const { name, value } = e.target

    setFormData(prev => ({ ...prev, [name]: value }))
    setValidationStatus(prev => ({ ...prev, [name]: null }))
  }

  const handleBlur = e => {
    const { name, value } = e.target
    const isValid = name === 'confirmPassword'
      ? validationRules.confirmPassword(value, formData.password)
      : validationRules[name]?.(value)

    setValidationStatus(prev => ({
      ...prev,
      [name]: isValid ? 'valid' : 'invalid'
    }))
  }

  const handleSavePassword = async e => {
    e.preventDefault()

    const isValid = validateForm()
    if (!isValid || !email) return

    setServerError(null)

    try {
      const data = await newPassword(email, formData.password)

      localStorage.setItem('token', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)

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