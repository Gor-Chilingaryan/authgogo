import React from 'react'
import style from './validationMessage.module.css'
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
	validationMessageStyle = style.validation_messages,
	children,
}) {
	if (status === 'invalid') {
		return (
			<div className={validationMessageStyle}>
				<p>{children}</p>
			</div>
		)
	}

	return null
}

export default ValidationMessages
