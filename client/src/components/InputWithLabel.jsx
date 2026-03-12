import React from 'react'

function InputWithLabel({
	type,
	groupStyle,
	labelStyle,
	labelText,
	inputStyle,
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
				id={type}
				type={type}
				name={type}
				className={inputStyle}
				value={value}
				onChange={changeValue}
				onBlur={onBlur}
			/>
		</div>
	)
}
export default InputWithLabel
