import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login } from './pages/login/Login'
import { Registration } from './pages/registration/Registration'
import ForgotPassword from './pages/forgot-password/ForgotPassword'
import { NewPassword } from './pages/new-password/newPassword'

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Login />} />
				<Route path='/registration' element={<Registration />} />
				<Route path='/forgot-password' element={<ForgotPassword />} />
				<Route path='/new-password' element={<NewPassword />} />
				<Route path='/homepage' element={<Homepage />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
