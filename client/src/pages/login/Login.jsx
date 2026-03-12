import React, { useState } from 'react'
import style from './login.module.css'
import { loginUser } from '../../api/login'

function Login() {
	const [formData, setFormData] = useState({ email: '', password: '' })

	const handleSignIn = async e => {
		e.preventDefault()
		try {
			const data = await loginUser(formData)

			localStorage.setItem('token', data.token)
			console.log('all right')
		} catch (err) {
			console.log(err.message || 'An error occurred')
		}
	}

	return (
		<div className={style.login_container}>
			<div className={style.login_content}>
				<h1 className={style.login_title}>SIGN IN</h1>

				<form className={style.login_form}>
					<div className={style.input_group}>
						<label htmlFor='email' className={style.label}>
							Email Address
						</label>
						<input
							id='email'
							type='email'
							name='email'
							className={style.input}
							value={formData.email}
							onChange={e =>
								setFormData({ ...formData, email: e.target.value })
							}
						/>
					</div>

					<div className={style.input_group}>
						<label htmlFor='password' className={style.label}>
							Password
						</label>
						<input
							id='password'
							type='password'
							name='password'
							className={style.input}
							value={formData.password}
							onChange={e =>
								setFormData({ ...formData, password: e.target.value })
							}
						/>
					</div>

					<a href='/forgot-password' className={style.forgot_password_link}>
						Forgot Password?
					</a>

					<div className={style.button_group}>
						<button
							type='submit'
							className={style.button}
							onClick={handleSignIn}
						>
							Sign in
						</button>

						<a href='/sign-up' className={style.sign_up_link}>
							Sign up
						</a>
					</div>
				</form>
			</div>
		</div>
	)
}

export { Login }
