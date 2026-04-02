/**
 * Frontend application root.
 * Defines public and protected routes for all pages.
 */
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components/hoc/index.jsx'
import { Login } from './pages/login/index.jsx'
import { Registration } from './pages/registration/index.jsx'
import ForgotPassword from './pages/forgot-password/index.jsx'
import { NewPassword } from './pages/new-password/index.jsx'
import { HomePage } from './pages/main-page/home-page/index.jsx'
import { NavigationEdit } from './pages/main-page/navigation-edit/index.jsx'
import { Messenger } from './pages/messenger/index.jsx'
/**
 * Configures top-level browser router and route tree.
 * @returns {JSX.Element} Application routing structure.
 */
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
