import React, { useEffect, useState } from 'react'
import style from './navigationEdit.module.css'
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
	useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useNavigationEdit } from './useNavigationEdit'
import {
	ArrowLeft,
	ChevronRight,
	BurgerIcon,
} from '../../../components/navigation-edit/NavigationEditUi'
import InputWithLabel from '../../../components/input-label/InputWithLabel'

function SortableItem({ item, BurgerIcon }) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: item._id })

	const initialStyle = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	return (
		<div
			ref={setNodeRef}
			style={initialStyle}
			className={style.navigationEdit_list_item}
		>
			<div {...attributes} {...listeners} style={{ cursor: 'grab' }}>
				<BurgerIcon />
			</div>
			<span className={style.navigationEdit_list_item_name}>{item.name}</span>
			{!item.isDefault && (
				<button className={style.navigationEdit_list_item_delete}>X</button>
			)}
		</div>
	)
}

function NavigationEdit() {
	const { navList: initailList, error, isLoading } = useNavigationEdit()
	const [items, setItems] = useState([])

	useEffect(() => {
		if (initailList) setItems(initailList)
	}, [initailList])

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	const handleDragEnd = event => {
		const { active, over } = event

		if (active.id !== over.id) {
			setItems(prev => {
				const oldIndex = prev.findIndex(item => item._id === active.id)
				const newIndex = prev.findIndex(item => item._id === over.id)
				const newArray = arrayMove(prev, oldIndex, newIndex)

				return newArray
			})
		}
	}

	if (isLoading) return <span className={style.loader}></span>
	if (error) return <div className={style.error}>{error}</div>

	return (
		<div className={style.navigationEdit_container}>
			<div className={style.navigationEdit_creating}>
				<button className={style.navigationEdit_creating_back_button}>
					<ArrowLeft /> Back
				</button>
				<div>
					<InputWithLabel type='text' name='name' labelText='Name' />
					<InputWithLabel type='text' name='URL' labelText='URL' />
				</div>
				<button className={style.navigationEdit_creating_add_button}>
					Add <ChevronRight />
				</button>
			</div>

			<div className={style.navigationEdit_list}>
				<div className={style.navigationEdit_list_item}>
					<BurgerIcon />
					<span className={style.navigationEdit_list_item_name}>Home</span>
				</div>

				<div className={style.navigationEdit_list_item}>
					<BurgerIcon />
					<span className={style.navigationEdit_list_item_name}>Messenger</span>
				</div>
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={items.map(item => item._id)}
						strategy={verticalListSortingStrategy}
					>
						{items.map(item => (
							<SortableItem
								key={item._id}
								item={item}
								BurgerIcon={BurgerIcon}
							/>
						))}
					</SortableContext>
				</DndContext>
				{/* {navList.map(item => (
					<div key={item._id} className={style.navigationEdit_list_item}>
						<BurgerIcon />
						<span className={style.navigationEdit_list_item_name}>
							{item.name}
						</span>
						{!item.isDefault && (
							<button className={style.navigationEdit_list_item_delete}>
								X
							</button>
						)}
					</div>
				))} */}
			</div>
		</div>
	)
}

export { NavigationEdit }
