import React from 'react'

export const validationRules = {
	firstName: value => value.length >= 2,
	lastName: value => value.length >= 2,
	email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
	password: value =>
		/^(?=.*\d)(?=.*[!@#$%^&* _])\S+$/.test(value) && value.length >= 8,
	confirmPassword: (value, password) => value === password,
}

function ValidationMessages({
	status,
	validationMessageStyle,
	errorTextStyle,
	children,
}) {
	if (status === 'invalid') {
		return (
			<div className={validationMessageStyle}>
				<p className={errorTextStyle}>{children}</p>
			</div>
		)
	}

	return null
}

export default ValidationMessages
