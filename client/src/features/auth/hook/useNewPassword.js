import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { newPassword } from '@features/auth/services/auth'
import { validationRules } from '@/components/validation-message'

function useNewPassword() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [serverError, setServerError] = useState(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })

  const [validationStatus, setValidationStatus] = useState({
    password: null,
    confirmPassword: null,
  })


  useEffect(() => {
    const isLogged = localStorage.getItem('isLogged') === 'true'
    if (isLogged) {
      navigate('/home', { replace: true })
    }
  }, [navigate])

  useEffect(() => {
    if (!token) {
      navigate('/forgot-password')
    }
  }, [token, navigate])

  const validateForm = () => {
    const statuses = {
      password: validationRules.password(formData.password) ? 'valid' : 'invalid',
      confirmPassword: validationRules.confirmPassword(formData.confirmPassword, formData.password) ? 'valid' : 'invalid',
    }
    setValidationStatus(statuses)
    return statuses.password === 'valid' && statuses.confirmPassword === 'valid'
  }

  const isFormValid = validationStatus.password === 'valid'
    && validationStatus.confirmPassword === 'valid'

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setValidationStatus(prev => ({ ...prev, [name]: null }))
    setServerError(null)
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
    if (!isValid || !token) return

    setLoading(true)
    try {

      await newPassword(token, formData.password)


      localStorage.setItem('isLogged', 'true')
      navigate('/home')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return {
    formData,
    validationStatus,
    isFormValid,
    handleBlur,
    handleChange,
    handleSavePassword,
    loading   
  }
}

export { useNewPassword }