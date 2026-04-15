/**
 * Registration page component.
 * Renders sign-up form with field-level validation messages.
 */
import React from 'react';
import style from './registration.module.css';
import { Link } from 'react-router-dom';
import InputWithLabel from '@/components/input-label';
import ValidationMessages from '@/components/validation-message';
import { useRegistrationForm } from '@features/auth/hook/useRegistrationForm';

function Registration() {
  const {
    inputs,
    activeError,
    isFormValid,
    handleBlur,
    handleRegistration,
    handleChange,
  } = useRegistrationForm();

  

  return (
    <>
      <div className={style.registration_content}>
        <h1 className={style.registration_title}>SIGN UP</h1>
        <form className={style.registration_form} onSubmit={handleRegistration}>
          {inputs.map((item) => (
            <InputWithLabel
              key={item.name}
              inputStyle={style.input}
              type={item.type}
              name={item.name}
              labelText={item.labelText}
              value={item.value}
              changeValue={handleChange}
              onBlur={handleBlur}
            />
          ))}
          {activeError && (
            <ValidationMessages
              status='invalid'
              errorTextStyle={style.error_text}
            >
              {activeError.message}
            </ValidationMessages>
          )}

          <Link to='/forgot-password' className={style.forgot_password_link}>
            Forgot Password?
          </Link>

          <div className={style.navigations_items}>
            <button
              type='submit'
              className={style.registration_button}
              disabled={!isFormValid}
            >
              Sign Up
            </button>

            <Link to='/' className={style.sign_in_link}>
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export { Registration };
