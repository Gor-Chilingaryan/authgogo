import React, { useState } from 'react'
import { validationRules } from '../../components/validation-message/ValidationMessage'
import { forgotPassword } from '../../api/requests'
import { useNavigate } from 'react-router-dom'


function useForgotPass() {
  const [formData, setFormData] = useState({ email: '' })
  const [validationStatus, setValidationStatus] = useState({ email: null })
  const navigate = useNavigate()

  const isFormValid = validationStatus.email === 'valid'

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

    if (!isFormValid) return

    try {
      const data = await forgotPassword(formData.email)

      navigate('/new-password', { state: { email: formData.email } })
    } catch (err) {
      console.error(err.message || 'An error occurred')
    }


  }

  return { formData, validationStatus, isFormValid, handleBlur, handleChange, handleForgotPas }
}

export { useForgotPass }
