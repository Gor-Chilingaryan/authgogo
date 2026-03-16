import React from 'react'
import style from './forgotPassword.module.css'
import { useForgotPass } from './useForgotPass'
import InputWithLabel from '../../components/input-label/InputWithLabel'
import ValidationMessages from '../../components/validation-message/ValidationMessage'
import { Link } from 'react-router-dom'

function ForgotPassword() {
	const {
		formData,
		validationStatus,
		isFormValid,
		handleBlur,
		handleChange,
		handleForgotPas,
	} = useForgotPass()

	return (
		<div className={style.forgot_password_container}>
			<div className={style.forgot_password_content}>
				<h1 className={style.forgot_password_title}>Forgot PASSWORD</h1>
				<form
					action=''
					className={style.forgot_password_form}
					onSubmit={handleForgotPas}
				>
					<InputWithLabel
						type='email'
						name='email'
						labelText='Email Address'
						value={formData.email}
						changeValue={handleChange}
						onBlur={handleBlur}
					/>

					<ValidationMessages
						status={validationStatus.email}
						errorTextStyle={style.error_text}
					>
						Please provide a valid email address
					</ValidationMessages>

					<div className={style.button_forgot_password}>
						<button
							type='submit'
							className={style.button}
							disabled={!isFormValid}
						>
							Send
						</button>
					</div>

					<nav>
						<Link className={style.sign_in_link} to='/'>
							Sign In
						</Link>
					</nav>
				</form>
			</div>
		</div>
	)
}

export default ForgotPassword
