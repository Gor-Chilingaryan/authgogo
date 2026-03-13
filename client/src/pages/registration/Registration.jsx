import React, { useState } from 'react'
import style from './registartion.module.css'
import InputWithLabel from '../../components/InputWithLabel'
import { Link, useNavigate } from 'react-router-dom'
import ValidationMessages, {
	validationRules,
} from '../../components/ValidationMessage'
import { registerUser } from '../../api/requests'

function Registration() {
	const navigate = useNavigate()

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

	const isFormValid =
		validationStatus.firstName === 'valid' &&
		validationStatus.lastName === 'valid' &&
		validationStatus.email === 'valid' &&
		validationStatus.password === 'valid' &&
		validationStatus.confirmPassword === 'valid'

	const handleBlur = e => {
		const { name, value } = e.target

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
		if (
			validationStatus.firstName !== 'valid' ||
			validationStatus.lastName !== 'valid' ||
			validationStatus.email !== 'valid' ||
			validationStatus.password !== 'valid' ||
			validationStatus.confirmPassword !== 'valid'
		) {
			return
		}
		try {
			const data = await registerUser(formData)
			localStorage.setItem('token', data.token)
			navigate('/homepage')
			console.log('Registration successful')
		} catch (err) {
			console.error(err.message || 'Registration failed')
		}
	}

	return (
		<div className={style.registration_container}>
			<div className={style.registration_content}>
				<h1 className={style.registration_title}>SIGN UP</h1>

				<form className={style.registration_form} onSubmit={handleRegistration}>
					<InputWithLabel
						type='text'
						name='firstName'
						groupStyle={style.input_group}
						labelStyle={style.label}
						inputStyle={style.input}
						labelText='First Name'
						value={formData.firstName}
						changeValue={e => {
							setFormData({ ...formData, firstName: e.target.value })
							setValidationStatus({
								...validationStatus,
								firstName: null,
							})
						}}
						onBlur={handleBlur}
					/>
					<ValidationMessages
						status={validationStatus.firstName}
						validationMessageStyle={style.validation_messages}
						errorTextStyle={style.error_text}
					>
						First Name is required
					</ValidationMessages>

					<InputWithLabel
						type='text'
						name='lastName'
						groupStyle={style.input_group}
						labelStyle={style.label}
						inputStyle={style.input}
						labelText='Last Name'
						value={formData.lastName}
						changeValue={e => {
							setFormData({ ...formData, lastName: e.target.value })
							setValidationStatus({
								...validationStatus,
								lastName: null,
							})
						}}
						onBlur={handleBlur}
					/>
					<ValidationMessages
						status={validationStatus.lastName}
						validationMessageStyle={style.validation_messages}
						errorTextStyle={style.error_text}
					>
						Last Name is required
					</ValidationMessages>

					<InputWithLabel
						type='email'
						name='email'
						groupStyle={style.input_group}
						labelStyle={style.label}
						inputStyle={style.input}
						labelText='Email'
						value={formData.email}
						changeValue={e => {
							setFormData({ ...formData, email: e.target.value })
							setValidationStatus({
								...validationStatus,
								email: null,
							})
						}}
						onBlur={handleBlur}
					/>
					<ValidationMessages
						status={validationStatus.email}
						validationMessageStyle={style.validation_messages}
						errorTextStyle={style.error_text}
					>
						Please provide a valid email address
					</ValidationMessages>

					<InputWithLabel
						type='password'
						name='password'
						groupStyle={style.input_group}
						labelStyle={style.label}
						inputStyle={style.input}
						labelText='Password'
						value={formData.password}
						changeValue={e => {
							setFormData({ ...formData, password: e.target.value })
							setValidationStatus({
								...validationStatus,
								password: null,
							})
						}}
						onBlur={handleBlur}
					/>
					<ValidationMessages
						status={validationStatus.password}
						validationMessageStyle={style.validation_messages}
						errorTextStyle={style.error_text}
					>
						Password must be 8+ chars, include a number and symbol (!@#$)
					</ValidationMessages>

					<InputWithLabel
						type='password'
						name='confirmPassword'
						groupStyle={style.input_group}
						labelStyle={style.label}
						inputStyle={style.input}
						labelText='Confirm Password'
						value={formData.confirmPassword}
						changeValue={e => {
							const val = e.target.value
							setFormData({ ...formData, confirmPassword: val })
							setValidationStatus({
								...validationStatus,
								confirmPassword:
									val === formData.password ? 'valid' : 'invalid',
							})
						}}
						onBlur={handleBlur}
					/>
					<ValidationMessages
						status={validationStatus.confirmPassword}
						validationMessageStyle={style.validation_messages}
						errorTextStyle={style.error_text}
					>
						Passwords do not match
					</ValidationMessages>

					<div className={style.button_group}>
						<button
							type='submit'
							className={style.registration_button}
							disabled={!isFormValid}
						>
							Sign Up
						</button>
					</div>

					<nav>
						<Link to='/login' className={style.sign_in_link}>
							Sign In
						</Link>
					</nav>
				</form>
			</div>
		</div>
	)
}

export { Registration }
