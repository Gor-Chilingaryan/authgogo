import React, { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { checkAuth } from '../../api/requests/auth'

function ProtectedRoute() {
	const [status, setStatus] = useState('checking')

	useEffect(() => {
		checkAuth()
			.then(() => setStatus('auth'))
			.catch(() => {
				localStorage.removeItem('isLogged')
				setStatus('unauth')
			})
	}, [])

	if (status === 'checking') return <span className='loader' />
	if (status === 'unauth') return <Navigate to='/' replace />

	return <Outlet />
}

export { ProtectedRoute }
