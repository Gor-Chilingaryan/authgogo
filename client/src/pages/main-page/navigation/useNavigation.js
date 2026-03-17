import { useEffect, useState } from 'react'
import { getAllNavigation } from '../../../api/requests/navigate'

export function useNavigation() {
  const [navItems, setNavItems] = useState([])
  const [error, setError] = useState(null)


  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getAllNavigation()
        setNavItems(data)
      } catch (error) {
        setError(error.message)
      }
    }
    fetchItems()
  }, [])

  return {
    navItems,
    error
  }
}
