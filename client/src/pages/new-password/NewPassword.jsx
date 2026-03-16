import React from 'react'
import style from './newPassword.module.css'
import InputWithLabel from '../../components/input-label/InputWithLabel'
import { Link } from 'react-router-dom'
import useNewPassword from './useNewPassword'
import ValidationMessages from '../../components/validation-message/ValidationMessage'
function NewPassword() {
	const {
		formData,
		validationStatus,
		isFormValid,
		handleBlur,
		handleChange,
		handleSavePassword,
		serverError,
	} = useNewPassword()
	return (
		<div className={style.reset_password_container}>
			<div className={style.reset_password_content}>
				<h1 className={style.reset_password_title}>CREATE NEW PASSWORD</h1>
				<form
					className={style.reset_password_form}
					onSubmit={handleSavePassword}
				>
					<InputWithLabel
						type='password'
						name='password'
						labelText='New Password'
						value={formData.password}
						changeValue={handleChange}
						onBlur={handleBlur}
					/>
					<ValidationMessages status={validationStatus.password}>
						Password must be 8+ chars, include a number and symbol (!@#$)
					</ValidationMessages>

					<InputWithLabel
						type='password'
						name='confirmPassword'
						labelText='Confirm Password'
						value={formData.confirmPassword}
						changeValue={handleChange}
						onBlur={handleBlur}
					/>
					<ValidationMessages status={validationStatus.confirmPassword}>
						Passwords do not match
					</ValidationMessages>

					<div className={style.button_save_password}>
						<button
							type='submit'
							className={style.button_save_password_button}
							disabled={!isFormValid}
						>
							Save
						</button>
						<div className={style.error_message_server}>{serverError}</div>
						<nav>
							<Link to='/' className={style.sign_in_link}>
								Sign In
							</Link>
						</nav>
					</div>
				</form>
			</div>
		</div>
	)
}

export { NewPassword }
