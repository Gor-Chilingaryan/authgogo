import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

function ProtectedRoute() {
	const isLogged = localStorage.getItem('isLogged') === 'true'

	if (!isLogged) {
		return <Navigate to='/' replace />
	}

	return <Outlet />
}

export { ProtectedRoute }
