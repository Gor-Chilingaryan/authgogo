import React from 'react'
import style from './inputWithLabel.module.css'

function InputWithLabel({
	type,
	name,
	groupStyle = style.input_group,
	labelStyle = style.label,
	inputStyle = style.input,
	labelText,
	value,
	changeValue,
	onBlur,
}) {
	return (
		<div className={groupStyle}>
			<label htmlFor={name} className={labelStyle}>
				{labelText}
			</label>
			<input
				id={name}
				type={type}
				name={name}
				className={inputStyle}
				value={value}
				onChange={changeValue}
				onBlur={onBlur}
			/>
		</div>
	)
}
export default InputWithLabel
