import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { validationRules } from '@/components/validation-message'
import { forgotPassword } from '@features/auth/services/auth'



function useForgotPass() {
  const [formData, setFormData] = useState({ email: '' })
  const [validationStatus, setValidationStatus] = useState({ email: null })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const isLogged = localStorage.getItem('isLogged') === 'true'
    if (isLogged) {
      navigate('/home', { replace: true })
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
      setIsLoading(true)
      await forgotPassword(formData.email)


    } catch (err) {
      setError(err.message)
    }
  }

  return {
    formData,
    validationStatus,
    isFormValid,
    handleBlur,
    handleChange,
    handleForgotPas,
    isLoading,
    error,
    navigate
  }
}

export { useForgotPass }
