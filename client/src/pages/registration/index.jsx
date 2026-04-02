/**
 * Registration page component.
 * Renders sign-up form with field-level validation messages.
 */
import React from 'react'
import style from './registration.module.css'
import InputWithLabel from '../../components/input-label/InputWithLabel'
import { Link } from 'react-router-dom'
import ValidationMessages from '../../components/validation-message/ValidationMessage'
import { useRegistrationForm } from './useRegistrationForm'

/**
 * Displays user registration UI.
 * @returns {JSX.Element} Registration screen.
 */
function Registration() {
	const {
		formData,
		validationStatus,
		isFormValid,
		handleBlur,
		handleRegistration,
		handleChange,
		serverError,
	} = useRegistrationForm()

	return (
		<div className={style.registration_container}>
			<div className={style.registration_content}>
				<h1 className={style.registration_title}>SIGN UP</h1>

				<form className={style.registration_form} onSubmit={handleRegistration}>
					<InputWithLabel
						type='text'
						name='firstName'
						labelText='First Name'
						value={formData.firstName}
						changeValue={handleChange}
						onBlur={handleBlur}
					/>
					<ValidationMessages status={validationStatus.firstName}>
						First Name is required
					</ValidationMessages>

					<InputWithLabel
						type='text'
						name='lastName'
						labelText='Last Name'
						value={formData.lastName}
						changeValue={handleChange}
						onBlur={handleBlur}
					/>
					<ValidationMessages status={validationStatus.lastName}>
						Last Name is required
					</ValidationMessages>

					<InputWithLabel
						type='email'
						name='email'
						labelText='Email'
						value={formData.email}
						changeValue={handleChange}
						onBlur={handleBlur}
					/>
					<ValidationMessages status={validationStatus.email}>
						Please provide a valid email address
					</ValidationMessages>

					<InputWithLabel
						type='password'
						name='password'
						labelText='Password'
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

					<div className={style.button_group}>
						<button
							type='submit'
							className={style.registration_button}
							disabled={!isFormValid}
						>
							Sign Up
						</button>
					</div>
					{serverError && (
						<div className={style.error_message_server}>{serverError}</div>
					)}

					<Link to='/' className={style.sign_in_link}>
						Sign In
					</Link>
				</form>
			</div>
		</div>
	)
}

export { Registration }
