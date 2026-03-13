import React from 'react'

function InputWithLabel({
	type,
	name,
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
