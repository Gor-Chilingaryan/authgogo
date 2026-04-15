import React from 'react';
import { Link  } from 'react-router-dom';
import style from './forgotPassword.module.css';
import { useForgotPass } from '@features/auth/hook/useForgotPass';
import InputWithLabel from '@/components/input-label';
import ValidationMessages from '@/components/validation-message';

function ForgotPassword() {
  const {
    formData,
    validationStatus,
    isFormValid,
    handleBlur,
    handleChange,
    handleForgotPas,
    isLoading,
    error,
    navigate,
  } = useForgotPass();

  return (
    <div className={style.forgot_password_container}>
      {isLoading ? (
        <div className={style.loading_container}>
          <h1>
            we sending you an email to reset <br /> your password
          </h1>
          <button onClick={() => navigate('/')} className={style.login_button}>
            Go to login
          </button>
        </div>
      ) : (
        <div className={style.forgot_password_content}>
          <h1 className={style.forgot_password_title}>Forgot PASSWORD</h1>

          <form
            action=''
            className={style.forgot_password_form}
            onSubmit={handleForgotPas}
          >
            <InputWithLabel
              inputStyle={style.input}
              type='email'
              name='email'
              labelText='Email Address'
              value={formData.email}
              changeValue={handleChange}
              onBlur={handleBlur}
            />

            <ValidationMessages status={validationStatus.email}>
              Please provide a valid email address
            </ValidationMessages>

            {error && <div className={style.error_text}>User not found</div>}

            <div className={style.navigations_items}>
              <button
                type='submit'
                className={style.button}
                disabled={!isFormValid}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
              <Link className={style.sign_in_link} to='/'>
                Sign In
              </Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export { ForgotPassword };
