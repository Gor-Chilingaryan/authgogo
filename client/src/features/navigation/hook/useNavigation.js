import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getNavigationItems } from '@features/navigation/services/navigate'
import { flatNavToTree } from '@features/navigation/utils/flatNavToTree'

export function useNavigation() {
  const navigate = useNavigate()
  const [flatItems, setFlatItems] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    const fetchItems = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getNavigationItems()
        if (cancelled) return
        setFlatItems(Array.isArray(data) ? data : [])
      } catch (err) {
        if (cancelled) return
        setFlatItems([])
        setError(err?.message ?? 'Failed to load navigation')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchItems()
    return () => {
      cancelled = true
    }
  }, [])

  const navRoots = useMemo(() => flatNavToTree(flatItems), [flatItems])

  const handleEditNavigation = useCallback(() => {
    navigate('/navigation-edit')
  }, [navigate])

  return {
    navRoots,
    flatNavItems: flatItems,
    error,
    isLoading,
    handleEditNavigation,
  }
}
