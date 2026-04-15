import React from 'react';
import { Link } from 'react-router-dom';
import style from './login.module.css';
import { useLoginForm } from '@features/auth/hook/useLoginForm';
import InputWithLabel from '@/components/input-label';
import ValidationMessages from '@/components/validation-message';

function Login() {
  const {
    formData,
    isFormValid,
    handleBlur,
    handleSignIn,
    handleChange,
    activeError,
    inputs,
  } = useLoginForm();

  return (
    <div className={style.login_container}>
      <div className={style.login_content}>
        <h1 className={style.login_title}>SIGN IN</h1>
        <form className={style.login_form} onSubmit={handleSignIn}>
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
          <div>
            {activeError && (
              <ValidationMessages
                status='invalid'
                errorTextStyle={style.error_text}
              >
                {activeError.message}
              </ValidationMessages>
            )}
          </div>

          <Link to='/forgot-password' className={style.forgot_password_link}>
            Forgot Password?
          </Link>

          <div className={style.navigations_items}>
            <button
              type='submit'
              className={style.button}
              disabled={!isFormValid}
            >
              Sign in
            </button>

            <Link to='/registration' className={style.sign_up_link}>
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export { Login };
