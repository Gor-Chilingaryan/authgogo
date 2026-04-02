/**
 * Route guard component.
 * Allows access only when local auth flag exists; otherwise redirects to login.
 */
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

/**
 * Renders protected route outlet or redirect.
 * @returns {JSX.Element} Outlet for authorized users or redirect.
 */
function ProtectedRoute() {
	const isLogged = localStorage.getItem('isLogged') === 'true'

	if (!isLogged) {
		return <Navigate to='/' replace />
	}

	return <Outlet />
}

export { ProtectedRoute }
