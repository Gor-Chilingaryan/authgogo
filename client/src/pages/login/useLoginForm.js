/**
 * Login form hook.
 * Stores login form state, validates credentials, and handles sign-in flow.
 */
import { useEffect, useState } from 'react'
import { validationRules } from '../../components/validation-message/ValidationMessage'
import { loginUser } from '../../api/requests/auth'
import { useNavigate } from 'react-router-dom'

/**
 * Provides state and handlers for login UI.
 * @returns {object} Login form state and event handlers.
 */
const useLoginForm = () => {
	const navigate = useNavigate()

	const [formData, setFormData] = useState({ email: '', password: '' })
	const [validationStatus, setValidationStatus] = useState({
		email: null,
		password: null,
	})

	const [serverError, setServerError] = useState(null)

	useEffect(() => {
		const isLogged = localStorage.getItem('isLogged') === 'true'

		if (isLogged) {
			navigate('/homepage', { replace: true })
		}
	}, [navigate])

	const isFormValid =
		validationStatus.email === 'valid' && validationStatus.password === 'valid'

	/**
	 * Validates all login fields before submit.
	 * @returns {boolean} True when form data is valid.
	 */
	const validateForm = () => {
		const emailValid = validationRules.email(formData.email) ? 'valid' : 'invalid'
		const passwordValid = validationRules.password(formData.password) ? 'valid' : 'invalid'

		setValidationStatus({
			email: emailValid,
			password: passwordValid,
		})
		return emailValid === 'valid' && passwordValid === 'valid'
	}


	/**
	 * Validates one field on blur.
	 * @param {React.FocusEvent<HTMLInputElement>} e - Blur event.
	 * @returns {void}
	 */
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

	/**
	 * Submits login request and redirects on success.
	 * @param {React.FormEvent<HTMLFormElement>} e - Form submit event.
	 * @returns {Promise<void>}
	 */
	const handleSignIn = async e => {
		e.preventDefault()

		const isValid = validateForm()
		if (!isValid) return

		try {
			await loginUser(formData)

			localStorage.setItem('isLogged', 'true')

			setServerError(null)
			navigate('/homepage')
		} catch (err) {
			setServerError(err.message || 'An error occurred')
		}
	}

	/**
	 * Updates form state as user types.
	 * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event.
	 * @returns {void}
	 */
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
