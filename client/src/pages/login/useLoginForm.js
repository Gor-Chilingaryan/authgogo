import { useState } from 'react'
import { validationRules } from '../../components/ValidationMessage'
import { loginUser } from '../../api/requests/requests'

const useLoginForm = () => {
	const [formData, setFormData] = useState({ email: '', password: '' })
	const [validationStatus, setValidationStatus] = useState({
		email: null,
		password: null,
	})

	const isFormValid =
		validationStatus.email !== 'valid' && validationStatus.password !== 'valid'

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

		if (
			validationStatus.email !== 'valid' ||
			validationStatus.password !== 'valid'
		) {
			return
		}

		try {
			const data = await loginUser(formData)

			localStorage.setItem('token', data.token)
			console.log('all right')
		} catch (err) {
			console.log(err.message || 'An error occurred')
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

	return {
		formData,
		validationStatus,
		isFormValid,
		handleBlur,
		handleSignIn,
		handleChange,
	}
}
export { useLoginForm }
