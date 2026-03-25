import React, { useEffect, useState } from 'react'
import { getAllNavigation } from '../../../api/requests/navigate'

function useNavigationEdit() {
	const [navList, setNavList] = useState([])
	const [error, setError] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		const fetchItems = async () => {
			try {
				setIsLoading(true)
				const data = await getAllNavigation()
				setNavList(Array.isArray(data) ? data : [])
			} catch (error) {
				setNavList([])
				setError(error.message)
			} finally {
				setIsLoading(false)
			}
		}
		fetchItems()
	}, [])

	return {
		navList,
		error,
		isLoading,
	}
}




export { useNavigationEdit }