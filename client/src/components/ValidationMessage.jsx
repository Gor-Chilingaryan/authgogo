import React from 'react'

export const validationRules = {
	email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
	password: value =>
		/^(?=.*\d)(?=.*[!@#$%^&*])\S+$/.test(value) && value.length >= 8,
}

function ValidationMessages({
	status,
	validationMessageStyle,
	errorTextStyle,
	emailErrorText,
	passwordErrorText,
}) {
	if (status.email === 'invalid') {
		return (
			<div className={validationMessageStyle}>
				<p className={errorTextStyle}>{emailErrorText}</p>
			</div>
		)
	}

	if (status.password === 'invalid') {
		return (
			<div className={validationMessageStyle}>
				<p className={errorTextStyle}>{passwordErrorText}</p>
			</div>
		)
	}

	return null
}

export default ValidationMessages
