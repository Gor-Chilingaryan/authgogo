
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '@features/auth/services/auth'
import { validationRules } from '@/components/validation-message'



const useLoginForm = () => {
	const navigate = useNavigate()

	const [formData, setFormData] = useState({ email: '', password: '' })
	const [validationStatus, setValidationStatus] = useState({
		email: null,
		password: null,
	})

	useEffect(() => {
		const isLogged = localStorage.getItem('isLogged') === 'true'

		if (isLogged) {
			navigate('/home', { replace: true })
		}
	}, [navigate])

	const isFormValid =
		validationStatus.email === 'valid' && validationStatus.password === 'valid'


	const validateForm = () => {
		const emailValid = validationRules.email(formData.email) ? 'valid' : 'invalid'
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
			await loginUser(formData)

			localStorage.setItem('isLogged', 'true')


			navigate('/home')
		} catch (err) {
			throw new Error(err.message || 'An error occurred')
		}
	}

	const handleChange = e => {
		const { name, value } = e.target
		setFormData({ ...formData, [name]: value })
		setValidationStatus({
			...validationStatus,
			[name]: null,
		})
	}

	const errors = [
		{
			condition: validationStatus.email === 'invalid',
			message: 'Please provide a valid email address',
		},
		{
			condition: validationStatus.password === 'invalid',
			message: 'Password must be 8+ chars, include a number and symbol (!@#$)',
		},
	];

	const activeError = errors.find((item) => item.condition);

	const inputs = [
		{
			type: 'email',
			name: 'email',
			labelText: 'Email Address',
			value: formData.email,
		},
		{
			type: 'password',
			name: 'password',
			labelText: 'Password',
			value: formData.password,
		},

	];

	return {
		formData,
		isFormValid,
		handleBlur,
		handleSignIn,
		handleChange,
		activeError,
		inputs
	}
}
export { useLoginForm }
