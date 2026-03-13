import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login } from './pages/Login/Login'
import { Registration } from './pages/registration/Registration'
function App() {
	// add a function for login page when user write inccorect email or password 10 times show a message  you have been blocked for 10 minutes
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/login' element={<Login />} />
				<Route path='/registration' element={<Registration />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
