/**
 * Navigation editor hook.
 * Handles CRUD operations, drag-and-drop ordering, and child item management.
 */
import { useEffect, useRef, useState } from 'react'
import {
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import {
	sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'

import { getNavigationItems, deleteNavigationItem, createNavigationItem, reorderNavigationTree } from '@features/navigation/services/navigate'

function useNavigationEdit() {
	const [items, setItems] = useState([])
	const [error, setError] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [collapsed, setCollapsed] = useState({})
	const [formData, setFormData] = useState({ title: '', path: '' })
	const itemsRef = useRef([])
	const reorderQueueRef = useRef(Promise.resolve())
	const latestReorderTokenRef = useRef(0)

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData({ ...formData, [name]: value })
	}

	const generatePath = (path) => {
		return '/' + path.toLowerCase().trim().split(' ').join('_')
	}

	const handleCreateItem = async () => {
		if (!formData.title.trim() || !formData.path.trim()) return
		try {
			await createNavigationItem({ ...formData, path: generatePath(formData.path) })
			setFormData({ title: '', path: '' })
			const data = await getNavigationItems()
			const safeItems = Array.isArray(data) ? data : []
			setItems(safeItems)
			itemsRef.current = safeItems
		} catch (error) {
			setError(error.message)
		}
	}

	/**
	 * Accepts the full reordered tree (after drag-and-drop) and saves it.
	 * Sends the entire tree to the backend so nesting (childMenu) and order are both persisted.
	 */
	const handleItemReorder = async (newTree) => {
		const previousTree = itemsRef.current
		const opId = Date.now()
		const token = ++latestReorderTokenRef.current
		console.debug('[NAV_REORDER] before optimistic update', {
			opId,
			token,
			prevSize: previousTree.length,
			nextSize: newTree.length,
		})
		setItems(newTree)
		itemsRef.current = newTree

		const syncReorder = async () => {
			try {
				console.debug('[NAV_REORDER] sending payload', {
					opId,
					token,
					tree: newTree,
				})
				await reorderNavigationTree(newTree)
				console.debug('[NAV_REORDER] request success', { opId, token })
			} catch (err) {
				const isLatest = token === latestReorderTokenRef.current
				console.error('[NAV_REORDER] request failed', {
					opId,
					token,
					isLatest,
					error: err?.message,
				})
				// Prevent stale rollback: older failed requests must not override newer optimistic UI.
				if (isLatest) {
					setItems(previousTree)
					itemsRef.current = previousTree
				}
				throw err
			}
		}

		reorderQueueRef.current = reorderQueueRef.current.then(syncReorder, syncReorder)

		try {
			await reorderQueueRef.current
		} catch (err) {
			console.error('Failed to reorder navigation:', err.message)
		}
	}

	const removeFromTree = (tree, idToRemove) => {
		return tree
			.filter((item) => item._id !== idToRemove)
			.map((item) => ({
				...item,
				childMenu: item.childMenu
					? removeFromTree(item.childMenu, idToRemove)
					: [],
			}))
	}

	const handleDeleteItem = async (id) => {
		const prevItems = items
		const newItems = removeFromTree(items, id)
		setItems(newItems)
		try {
			await deleteNavigationItem(id)
			await reorderNavigationTree(newItems)
		} catch (error) {
			setItems(prevItems)
			console.error('Failed to delete navigation item:', error.message)
		}
	}

	const handleCollapse = (id) => {
		setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }))
	}

	useEffect(() => {
		itemsRef.current = items
	}, [items])

	useEffect(() => {
		const fetchItems = async () => {
			try {
				setIsLoading(true)
				const data = await getNavigationItems()
				const safeItems = Array.isArray(data) ? data : []
				setItems(safeItems)
				itemsRef.current = safeItems
			} catch (error) {
				setItems([])
				setError(error.message)
			} finally {
				setIsLoading(false)
			}
		}
		fetchItems()
	}, [])

	return {
		handleDeleteItem,
		handleChange,
		handleCreateItem,
		handleItemReorder,
		handleCollapse,
		sensors,
		items,
		error,
		isLoading,
		formData,
		collapsed,
	}
}

export { useNavigationEdit }
