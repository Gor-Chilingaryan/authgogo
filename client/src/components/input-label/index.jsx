/**
 * Reusable labeled input component.
 * Standardizes markup and styling for form fields across pages.
 */
import React from 'react';
import style from './inputWithLabel.module.css';

/**
 * Renders a label and input pair.
 * @param {object} props - Component props.
 * @returns {JSX.Element} Styled input group.
 */
function InputWithLabel({
  type,
  name,
  groupStyle = '',
  labelStyle = '',
  inputStyle = '',
  labelText = '',
  value = null,
  changeValue = () => {},
  onBlur = () => {},
  placeholder = null,
  disabled = false,
}) {
  return (
    <div className={`${groupStyle} ${style.input_group}`}>
      <label htmlFor={name} className={`${labelStyle} ${style.label}`}>
        {labelText}
      </label>
      <input
        disabled={disabled}
        id={name}
        type={type}
        name={name}
        className={`${style.input} ${inputStyle} `}
        value={value}
        onChange={changeValue}
        onBlur={onBlur}
        placeholder={placeholder}
      />
    </div>
  );
}
export default InputWithLabel;
