import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components/hoc/ProtectedRoute'
import { Login } from './pages/login/Login'
import { Registration } from './pages/registration/Registration'
import ForgotPassword from './pages/forgot-password/ForgotPassword'
import { NewPassword } from './pages/new-password/newPassword'
import { HomePage } from './pages/main-page/home-page/HomePage'
import { NavigationEdit } from './pages/main-page/navigation-edit/NavigationEdit'
import {Messenger} from './pages/messenger/Messenger'

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Login />} />
				<Route path='/registration' element={<Registration />} />
				<Route path='/forgot-password' element={<ForgotPassword />} />
				<Route path='/new-password' element={<NewPassword />} />
				<Route element={<ProtectedRoute />}>
					<Route path='/homepage' element={<HomePage />} />
					<Route path='/navigation-edit' element={<NavigationEdit />} />
					<Route path='/messenger' element={<Messenger />} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App
