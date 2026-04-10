
import { useEffect, useRef, useState } from 'react'

import { getNavigationItems, deleteNavigationItem, createNavigationItem, reorderNavigationTree } from '@features/navigation/services/navigate'

const deriveParentIds = (flatItems) => {
	const items = [...flatItems].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
	return items.map((item, index) => {
		const depth = Number.isFinite(item.depth) ? Math.max(0, item.depth) : 0
		if (depth === 0) return { ...item, depth: 0, parentId: null }

		let parentId = null
		let bestDepth = -1
		for (let i = index - 1; i >= 0; i -= 1) {
			const prevDepth = Number.isFinite(items[i].depth) ? Math.max(0, items[i].depth) : 0
			if (prevDepth < depth) {
				parentId = items[i]._id
				bestDepth = prevDepth
				if (prevDepth === depth - 1) break
			}
		}

		return {
			...item,
			depth: bestDepth >= 0 ? depth : 0,
			parentId: bestDepth >= 0 ? parentId : null,
		}
	})
}

const removeSubtreeById = (flatItems, idToDelete) => {
	const ordered = [...flatItems].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
	const startIndex = ordered.findIndex((item) => item._id === idToDelete)
	if (startIndex < 0) return ordered

	const parentDepth = Number.isFinite(ordered[startIndex]?.depth)
		? Math.max(0, ordered[startIndex].depth)
		: 0

	let endIndex = startIndex + 1
	while (endIndex < ordered.length) {
		const depth = Number.isFinite(ordered[endIndex]?.depth)
			? Math.max(0, ordered[endIndex].depth)
			: 0
		if (depth <= parentDepth) break
		endIndex += 1
	}

	return [
		...ordered.slice(0, startIndex),
		...ordered.slice(endIndex),
	]
}

const normalizeFlatItems = (flatItems) =>
	deriveParentIds(
		[...(Array.isArray(flatItems) ? flatItems : [])]
			.sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
			.map((item, index) => ({
				...item,
				position: Number.isFinite(item.position) ? item.position : index + 1,
				depth: Number.isFinite(item.depth) ? Math.max(0, item.depth) : 0,
			}))
	)

const toReorderPayload = (flatItems) =>
	flatItems.map((item) => ({
		_id: item._id,
		position: item.position,
		depth: Number.isFinite(item.depth) ? Math.max(0, item.depth) : 0,
		parentId: item.parentId ?? null,
	}))

function useNavigationEdit() {
	const [items, setItems] = useState([])
	const [error, setError] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [formData, setFormData] = useState({ title: '', path: '' })
	const itemsRef = useRef([])
	const reorderQueueRef = useRef(Promise.resolve())
	const latestReorderTokenRef = useRef(0)

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
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
			const normalizedItems = normalizeFlatItems(data)
			setItems(normalizedItems)
			itemsRef.current = normalizedItems
		} catch (error) {
			setError(error.message)
		}
	}

	/**
	 * Accepts the full reordered tree (after drag-and-drop) and saves it.
	 * Sends the entire tree to the backend so nesting (childMenu) and order are both persisted.
	 */
	const handleItemReorder = async (newItems) => {
		const normalizedItems = deriveParentIds(newItems)
		const previousItems = itemsRef.current
		const opId = Date.now()
		const token = ++latestReorderTokenRef.current
		console.debug('[NAV_REORDER] before optimistic update', {
			opId,
			token,
			prevSize: previousItems.length,
			nextSize: normalizedItems.length,
		})
		setItems(normalizedItems)
		itemsRef.current = normalizedItems

		const syncReorder = async () => {
			const payload = toReorderPayload(normalizedItems)
			try {
				console.debug('[NAV_REORDER] sending payload', {
					opId,
					token,
					items: payload,
				})
				await reorderNavigationTree(payload)
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
					setItems(previousItems)
					itemsRef.current = previousItems
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

	const handleDeleteItem = async (id) => {
		const prevItems = items
		const withoutSubtree = removeSubtreeById(items, id)
		const newItems = deriveParentIds(withoutSubtree
			.map((item, index) => ({ ...item, position: index + 1 })))
		setItems(newItems)
		try {
			await deleteNavigationItem(id)
			await reorderNavigationTree(toReorderPayload(newItems))
		} catch (error) {
			setItems(prevItems)
			console.error('Failed to delete navigation item:', error.message)
		}
	}

	useEffect(() => {
		itemsRef.current = items
	}, [items])

	useEffect(() => {
		const fetchItems = async () => {
			try {
				setIsLoading(true)
				const data = await getNavigationItems()
				const normalized = normalizeFlatItems(data)
				setItems(normalized)
				itemsRef.current = normalized
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
		items,
		error,
		isLoading,
		formData,
	}
}

export { useNavigationEdit }
