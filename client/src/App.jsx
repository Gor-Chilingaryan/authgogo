import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login } from './pages/login/Login'
import { Registration } from './pages/registration/Registration'
import ForgotPassword from './pages/forgot-password/ForgotPassword'
function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/login' element={<Login />} />
				<Route path='/registration' element={<Registration />} />
				<Route path='/forgot-password' element={<ForgotPassword />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
