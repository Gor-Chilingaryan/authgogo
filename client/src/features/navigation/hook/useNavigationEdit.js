/**
 * Navigation editor hook.
 * Handles CRUD operations, drag-and-drop ordering, and child item management.
 */
import { useEffect, useState } from 'react'
import {
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import {
	arrayMove,
	sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'

import { getAllNavigation, deleteNavigationItem, createNavigationItem, updateNavigationItem, deleteChildNavigation } from '@features/navigation/services/navigate'


/**
 * Provides full state and actions for navigation editor UI.
 * @returns {object} Navigation editor state and handlers.
 */
function useNavigationEdit() {
	const [items, setItems] = useState([])
	const [error, setError] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	const [formData, setFormData] = useState({ name: '', path: '' })

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	/**
	 * Updates create-item form values.
	 * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event.
	 * @returns {void}
	 */
	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData({ ...formData, [name]: value })
	}

	/**
	 * Creates a new navigation item from form data.
	 * @returns {Promise<void>}
	 */

	const generatePath = (path) => {
		return '/' + path
			.toLowerCase()
			.trim()
			.split(' ')
			.join('_')
	}

	const handleCreateItem = async () => {
		if (!formData.name.trim() || !formData.path.trim()) return

		try {
			const response = await createNavigationItem({ ...formData, path: generatePath(formData.path) })

			const newItem = response.json || response
			setItems((prev => [...prev, newItem]))

			setFormData({ name: '', path: '' })
		} catch (error) {
			setError(error.message)
		}
	}

	/**
	 * Persists reordered navigation after drag-and-drop.
	 * @param {{active: {id: string}, over?: {id: string}}} event - DnD end event.
	 * @returns {Promise<void>}
	 */
	const handleDragEnd = async (event) => {
		const { active, over } = event

		if (over && active.id !== over.id) {
			const oldIndex = items.findIndex((item) => item._id === active.id)
			const newIndex = items.findIndex((item) => item._id === over.id)
			const reorderedItems = arrayMove(items, oldIndex, newIndex)

			setItems(reorderedItems)
			try {
				const dataToSave = reorderedItems.map((item, index) => ({
					_id: item._id,
					index: index + 1
				}))

				await updateNavigationItem(dataToSave)
			} catch (err) {
				throw new Error(err.message || 'Failed to update navigation item')
			}
		}
	}

	/**
	 * Deletes one navigation item by id.
	 * @param {string} id - Navigation id.
	 * @returns {Promise<void>}
	 */
	const handleDeleteItem = async (id) => {
		try {
			await deleteNavigationItem(id)

			setItems((prev) => prev.filter((item) => item._id !== id))
		} catch (error) {
			const backenError = error.response?.data
			console.error('Failed to delete navigation item:', backenError || error.message)
			throw new Error(backenError?.message || 'Failed to delete navigation item')
		}
	}

	/**
	 * Deletes one child menu item from a parent entry.
	 * @param {string} parentId - Parent navigation id.
	 * @param {string} childId - Child menu id.
	 * @returns {Promise<void>}
	 */
	const handleDeleteChild = async (parentId, childId) => {
		try {
			const response = await deleteChildNavigation(parentId, childId)

			const updatedParent = response?.json || response
			const hasUpdatedParentShape =
				updatedParent &&
				typeof updatedParent === 'object' &&
				updatedParent._id === parentId &&
				Array.isArray(updatedParent.childMenu)

			if (hasUpdatedParentShape) {
				setItems((prev) =>
					prev.map((item) => (item._id === parentId ? updatedParent : item)),
				)
				return
			}

			// Fallback: backend didn't return updated parent; update client state locally.
			setItems((prev) =>
				prev.map((item) => {
					if (item._id !== parentId) return item
					const nextChildMenu = Array.isArray(item.childMenu)
						? item.childMenu.filter((child) => child._id !== childId)
						: item.childMenu
					return { ...item, childMenu: nextChildMenu }
				}),
			)
		} catch (err) {
			throw new Error(err.message || 'Failed to delete child navigation')
		}
	}

	useEffect(() => {
		const fetchItems = async () => {
			try {
				setIsLoading(true)
				const response = await getAllNavigation()

				const data = response.json || response

				setItems(Array.isArray(data) ? data : [])
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
		handleDragEnd,
		handleDeleteItem,
		handleChange,
		handleCreateItem,
		handleDeleteChild,
		sensors,
		items,
		error,
		isLoading,
		formData
	}
}

export { useNavigationEdit }