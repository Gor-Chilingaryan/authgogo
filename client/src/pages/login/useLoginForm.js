import { useEffect, useState } from 'react'
import { validationRules } from '../../components/validation-message/ValidationMessage'
import { loginUser } from '../../api/requests/auth'
import { useNavigate } from 'react-router-dom'

const useLoginForm = () => {
	const navigate = useNavigate()
	const [formData, setFormData] = useState({ email: '', password: '' })
	const [validationStatus, setValidationStatus] = useState({
		email: null,
		password: null,
	})
	const [serverError, setServerError] = useState(null)

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			navigate('/homepage', { replace: true })
		}
	}, [navigate])

	const isFormValid =
		validationStatus.email === 'valid' && validationStatus.password === 'valid'

	const validateForm = () => {
		const emailValid = validationRules.email(formData.email) ? "valid" : 'invalid'
		const passwordValid = validationRules.password(formData.password) ? 'valid' : 'invalid'

		setValidationStatus({
			email: emailValid,
			password: passwordValid,
		})
		return emailValid === 'valid' && passwordValid === 'valid'
	}


	const handleBlur = e => {
		const { name, value } = e.target
		if (validationRules[name]) {
			const isValid = validationRules[name](value)
			setValidationStatus(prev => ({
				...prev,
				[name]: isValid ? 'valid' : 'invalid',
			}))
		}
	}

	const handleSignIn = async e => {
		e.preventDefault()


		const isValid = validateForm()

		if (!isValid) return

		try {
			const data = await loginUser(formData)

			localStorage.setItem('token', data.token)

			setServerError(null)

			navigate('/homepage')
		} catch (err) {
			setServerError(err.message || 'An error occurred')
		}
	}

	const handleChange = e => {
		const { name, value } = e.target
		setFormData({ ...formData, [name]: value })
		setValidationStatus({
			...validationStatus,
			[name]: null,
		})
		if (serverError) setServerError(null)
	}

	return {
		formData,
		validationStatus,
		isFormValid,
		handleBlur,
		handleSignIn,
		handleChange,
		serverError,
	}
}
export { useLoginForm }
