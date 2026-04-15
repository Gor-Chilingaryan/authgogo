import React from 'react';
import style from './newPassword.module.css';
import { Link, useParams } from 'react-router-dom';

import InputWithLabel from '@/components/input-label';
import { useNewPassword } from '@features/auth/hook/useNewPassword';
import ValidationMessages from '@/components/validation-message';


function NewPassword() {
  const { token } = useParams();
  const {
    formData,
    validationStatus,
    isFormValid,
    handleBlur,
    handleChange,
    handleSavePassword,
    loading,
  } = useNewPassword(token);

  const errors = [
    {
      condition: validationStatus.password === 'invalid',
      message: 'Password must be 8+ chars, include a number and symbol (!@#$)',
    },
    {
      condition: validationStatus.confirmPassword === 'invalid',
      message: 'Passwords do not match',
    },
  ];

  const activeError = errors.find((item) => item.condition);

  return (
    <>
      <div className={style.reset_password_content}>
        <h1 className={style.reset_password_title}>CREATE NEW PASSWORD</h1>
        <form
          className={style.reset_password_form}
          onSubmit={handleSavePassword}
        >
          <InputWithLabel
            inputStyle={style.input}
            type='password'
            name='password'
            labelText='New Password'
            value={formData.password}
            changeValue={handleChange}
            onBlur={handleBlur}
          />

          <InputWithLabel
            inputStyle={style.input}
            type='password'
            name='confirmPassword'
            labelText='Confirm Password'
            value={formData.confirmPassword}
            changeValue={handleChange}
            onBlur={handleBlur}
          />
          <div>
            {activeError && (
              <ValidationMessages status={'invalid'}>
                {activeError.message}
              </ValidationMessages>
            )}
          </div>

          <div className={style.navigate_items}>
            
            <button
              type='submit'
              className={style.button}
              disabled={!isFormValid}
            >
              {loading ? 'Saving...' : 'Save'}
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

export { NewPassword };
