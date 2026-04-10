  /**
   * Navigation hook.
   * Fetches user navigation items and exposes redirect action to edit page.
   */
  import { useEffect, useState } from 'react'
  import { useNavigate } from 'react-router-dom'

import { getNavigationItems } from '@features/navigation/services/navigate'

  /**
   * Provides top-navigation data and actions.
   * @returns {{navItems: Array, error: string|null, isLoading: boolean, handleEditNavigation: Function}} Hook API.
   */
  export function useNavigation() {
    const navigate = useNavigate()
    const [navItems, setNavItems] = useState([])
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
      const fetchItems = async () => {
        try {
          setIsLoading(true)
          const data = await getNavigationItems()
          setNavItems(Array.isArray(data) ? data : [])
        } catch (error) {
          setNavItems([])
          setError(error.message)
        } finally {
          setIsLoading(false)
        }
      }
      fetchItems()
    }, [])

    /**
     * Redirects user to navigation editor.
     * @returns {void}
     */
    const handleEditNavigation = () => {
      navigate('/navigation-edit')
    }

    return {
      navItems,
      error,
      isLoading,
      handleEditNavigation
    }
  }
