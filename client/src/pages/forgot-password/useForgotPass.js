import { useEffect, useState } from 'react'
import { validationRules } from '../../components/validation-message/ValidationMessage'
import { forgotPassword } from '../../api/requests/auth'
import { useNavigate } from 'react-router-dom'

function useForgotPass() {
  const [formData, setFormData] = useState({ email: '' })
  const [validationStatus, setValidationStatus] = useState({ email: null })
  const [serverError, setServerError] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/homepage', { replace: true })
    }
  }, [navigate])

  const isFormValid = validationStatus.email === 'valid'

  const validateForm = () => {
    const isValid = validationRules.email(formData.email)
    setValidationStatus({ email: isValid ? 'valid' : 'invalid' })
    return isValid
  }


  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setValidationStatus({ ...validationStatus, [name]: null })

    if (serverError) setServerError(null)
  }

  const handleBlur = e => {
    const { name, value } = e.target
    if (validationRules[name]) {
      const isValid = validationRules[name](value)
      setValidationStatus({
        ...validationStatus,
        [name]: isValid ? 'valid' : 'invalid',
      })
    }
  }

  const handleForgotPas = async e => {
    e.preventDefault()

    const isValid = validateForm()
    if (!isValid) return

    try {
      setServerError(null)
      await forgotPassword(formData.email)

      navigate('/new-password', { state: { email: formData.email } })
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
    handleForgotPas,
    serverError,
  }
}

export { useForgotPass }
