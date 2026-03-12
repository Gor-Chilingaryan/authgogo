import React, { useState } from 'react'
import style from './login.module.css'
import { loginUser } from '../../api/login'
import InputWithLabel from '../../components/InputWithLabel'
import ValidationMessages, {
	validationRules,
} from '../../components/ValidationMessage'

function Login() {
	const [formData, setFormData] = useState({ email: '', password: '' })
	const [validationStatus, setValidationStatus] = useState({
		email: null,
		password: null,
	})

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

	return (
		<div className={style.login_container}>
			<div className={style.login_content}>
				<h1 className={style.login_title}>SIGN IN</h1>
				<form className={style.login_form}>
					<InputWithLabel
						type='email'
						groupStyle={style.input_group}
						labelStyle={style.label}
						labelText='Email Address'
						inputStyle={style.input}
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

					<InputWithLabel
						type='password'
						groupStyle={style.input_group}
						labelStyle={style.label}
						labelText='Password'
						inputStyle={style.input}
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
						status={validationStatus}
						validationMessageStyle={style.validation_messages}
						errorTextStyle={style.error_text}
						emailErrorText='Please provide a valid email or password'
						passwordErrorText='Password must be 8+ chars, include a number and symbol (!@#$)'
					/>

					<a href='/forgot-password' className={style.forgot_password_link}>
						Forgot Password?
					</a>

					<div className={style.button_group}>
						<button
							type='submit'
							className={style.button}
							onClick={handleSignIn}
							disabled={
								validationStatus.email !== 'valid' ||
								validationStatus.password !== 'valid'
							}
						>
							Sign in
						</button>

						<a href='/sign-up' className={style.sign_up_link}>
							Sign up
						</a>
					</div>
				</form>
			</div>
		</div>
	)
}

export { Login }
