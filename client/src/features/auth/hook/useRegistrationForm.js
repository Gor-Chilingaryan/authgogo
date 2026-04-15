
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { validationRules } from '@/components/validation-message'
import { registerUser } from '@features/auth/services/auth'


function useRegistrationForm() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState(null)

  useEffect(() => {
    const isLogged = localStorage.getItem('isLogged') === 'true'
    if (isLogged) {
      navigate('/home', { replace: true })
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

  const isFormValid = useMemo(() => Object
    .values(validationStatus)
    .every(status => status === 'valid'),
    [validationStatus]
  )


  const validateForm = useCallback(() => {
    const statuses = {
      firstName: validationRules.firstName(formData.firstName) ? 'valid' : 'invalid',
      lastName: validationRules.lastName(formData.lastName) ? 'valid' : 'invalid',
      email: validationRules.email(formData.email) ? 'valid' : 'invalid',
      password: validationRules.password(formData.password) ? 'valid' : 'invalid',
      confirmPassword: validationRules.confirmPassword(formData.confirmPassword, formData.password) ? 'valid' : 'invalid',
    }
    setValidationStatus(statuses)

    return Object.values(statuses).every(status => status === 'valid')
  }, [formData])

  const handleChange = e => {
    const { name, value } = e.target
    const updateFormData = { ...formData, [name]: value }
    setFormData(updateFormData)

    setServerError(null)

    setValidationStatus(prev => {
      const newStatus = { ...prev, [name]: null }

      if (name === 'password' && formData.confirmPassword) {
        const isMatch = validationRules.confirmPassword(formData.confirmPassword, value)
        newStatus.confirmPassword = isMatch ? 'valid' : 'invalid'
      }

      return newStatus
    })
  }

  const handleBlur = e => {
    const { name, value } = e.target
    if (!value) return

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
    if (!validateForm()) return

    try {
      const { confirmPassword, ...registerData } = formData
      await registerUser(registerData)
      localStorage.setItem('isLogged', 'true')

      navigate('/home')
    } catch (err) {
      setServerError(err.message || 'An error occurred')
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {

      const hasValues = Object.values(formData).some(value => value.length > 0);
      const hasNoStatus = Object.values(validationStatus).every(status => status === null);

      if (hasValues && hasNoStatus) {
        validateForm();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData, validateForm, validationStatus]);


  const inputs = [
    {
      type: 'text',
      name: 'firstName',
      labelText: 'First Name',
      value: formData.firstName,
    },
    {
      type: 'text',
      name: 'lastName',
      labelText: 'Last Name',
      value: formData.lastName,
    },

    {
      type: 'email',
      name: 'email',
      labelText: 'Email',
      value: formData.email,
    },
    {
      type: 'password',
      name: 'password',
      labelText: 'Password',
      value: formData.password,
    },

    {
      type: 'password',
      name: 'confirmPassword',
      labelText: 'Confirm Password',
      value: formData.confirmPassword,
    },
  ];

  const errors = [
    {
      condition: validationStatus.firstName === 'invalid',
      message: 'First Name is required',
    },
    {
      condition: validationStatus.lastName === 'invalid',
      message: 'Last Name is required',
    },
    {
      condition: validationStatus.email === 'invalid',
      message: 'Please provide a valid email address',
    },
    {
      condition: validationStatus.password === 'invalid',
      message: 'Password must be 8+ chars, include a number and symbol (!@#$)',
    },
    {
      condition: validationStatus.confirmPassword === 'invalid',
      message: 'Passwords do not match',
    },
    {
      condition: serverError,
      message: 'User already exists. Please try again with a different email address.',
    },
  ];
  const activeError = errors.find((item) => item.condition);


  return {
    inputs,
    activeError,
    isFormValid,
    handleBlur,
    handleRegistration,
    handleChange,
  }
}

export { useRegistrationForm }