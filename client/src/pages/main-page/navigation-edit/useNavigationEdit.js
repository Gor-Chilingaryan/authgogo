import { useEffect, useState } from 'react'
import { getAllNavigation, deleteNavigationItem, createNavigationItem, updateNavigationItem, deleteChildNavigation } from '../../../api/requests/navigate'
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

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData({ ...formData, [name]: value })
	}

	const handleCreateItem = async () => {
		if (!formData.name.trim() || !formData.path.trim()) return

		try {
			const response = await createNavigationItem(formData)

			const newItem = response.json || response
			setItems((prev => [...prev, newItem]))
			setFormData({ name: "", path: '' })
		} catch (error) {
			setError(error.message)
		}
	}

	const handleDragEnd = async (event) => {
		const { active, over } = event

		if (over && active.id !== over.id) {
			const oldIndex = items.findIndex((item) => item._id === active.id)
			const newIndex = items.findIndex((item) => item._id === over.id)
			const reorderedItems = arrayMove(items, oldIndex, newIndex)

			setItems(reorderedItems)
			try {
				const dataToSave = reorderedItems.map((item) => ({
					_id: item._id,
				}))

				await updateNavigationItem(dataToSave)
			} catch (error) {

				throw new Error('Failed to update navigation item')
			}
		}
	}

	const handleDeleteItem = async (id) => {
		try {
			const response = await deleteNavigationItem(id)

			setItems((prev) => prev.filter((item) => item._id !== id))
		} catch (error) {
			const backenError = error.response?.data
			console.error('Failed to delete navigation item:', backenError || error.message)
			throw new Error(backenError?.message || 'Failed to delete navigation item')
		}
	}

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
		} catch (error) {

			throw new Error('Failed to delete child navigation')
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
		setItems,
		items,
		error,
		isLoading,
		formData
	}
}

export { useNavigationEdit }