/**
 * New password hook.
 * Validates and submits password reset form for a known email.
 */
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { newPassword } from '@features/auth/services/auth'
import { validationRules } from '@components/validation-message/ValidationMessage'


/**
 * Provides password reset form state and actions.
 * @returns {object} Reset form state and handlers.
 */
function useNewPassword() {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email

  useEffect(() => {
    const isLogged = localStorage.getItem('isLogged') === 'true'
    if (isLogged) {
      navigate('/home', { replace: true })
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

  /**
   * Validates both password fields before submit.
   * @returns {boolean} True when password and confirmation are valid.
   */
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

  /**
   * Updates local password form state.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event.
   * @returns {void}
   */
  const handleChange = e => {
    const { name, value } = e.target

    setFormData(prev => ({ ...prev, [name]: value }))
    setValidationStatus(prev => ({ ...prev, [name]: null }))
  }

  /**
   * Validates one field on blur.
   * @param {React.FocusEvent<HTMLInputElement>} e - Blur event.
   * @returns {void}
   */
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

  /**
   * Persists new password and signs in user on success.
   * @param {React.FormEvent<HTMLFormElement>} e - Form submit event.
   * @returns {Promise<void>}
   */
  const handleSavePassword = async e => {
    e.preventDefault()

    const isValid = validateForm()
    if (!isValid || !email) return



    try {
      const data = await newPassword(email, formData.password)

      localStorage.setItem('isLogged', 'true')
      navigate('/home')
    } catch (err) {
      throw new Error(err.message || 'An error occurred')
    }

  }

  return {
    formData,
    validationStatus,
    isFormValid,
    handleBlur,
    handleChange,
    handleSavePassword,

  }
}

export { useNewPassword}