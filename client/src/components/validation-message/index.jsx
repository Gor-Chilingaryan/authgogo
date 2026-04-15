import React from 'react';
import style from './validationMessage.module.css';

export const validationRules = {
  firstName: (value) =>
    /^[a-zA-Zа-яА-ЯёЁ\- ]+$/.test(value) && value.length >= 2,
  lastName: (value) =>
    /^[a-zA-Zа-яА-ЯёЁ\- ]+$/.test(value) && value.length >= 2,
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  password: (value) =>
    /^(?=.*\d)(?=.*[!@#$%^&* _])\S+$/.test(value) && value.length >= 8,
  confirmPassword: (value, password) => value === password && value.length >= 8,
};


function ValidationMessages({
  status,
  validationMessageStyle = '',
  validationMessageTextStyle = '',
  children,
}) {
  if (status === 'invalid') {
    return (
      <div className={`${validationMessageStyle} ${style.validation_messages}`}>
        <p
          className={`${validationMessageTextStyle} ${style.validation_message_text}`}
        >
          {children}
        </p>
      </div>
    );
  }

  return null;
}

export default ValidationMessages;
