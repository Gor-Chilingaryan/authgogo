/**
 * Navigation editor page component.
 * Displays create form and sortable navigation list for custom menu management.
 */
import React from 'react'
import style from './navigationEdit.module.css'
import { useNavigationEdit } from './useNavigationEdit'
import {
	SortableItem,
	ArrowLeft,
	ChevronRight,
	BurgerIcon,
} from '../../../components/navigation-edit/NavigationSort'
import InputWithLabel from '../../../components/input-label/InputWithLabel'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useNavigate } from 'react-router-dom'

/**
 * Renders drag-and-drop navigation management UI.
 * @returns {JSX.Element} Navigation editor screen.
 */
function NavigationEdit() {
	const navigate = useNavigate()
	const {
		handleDragEnd,
		handleDeleteItem,
		handleChange,
		handleCreateItem,
		handleDeleteChild,
		sensors,
		setItems,
		items,
		error,
		formData,
		isLoading,
	} = useNavigationEdit()

	if (isLoading) return <span className={style.loader}></span>
	if (error) return <div className={style.error}>{error}</div>

	return (
		<div className={style.navigationEdit_container}>
			<div className={style.navigationEdit_creating}>
				<button
					onClick={() => navigate('/homepage')}
					className={style.navigationEdit_creating_back_button}
				>
					<ArrowLeft /> Back
				</button>
				<div>
					<InputWithLabel
						type='text'
						name='name'
						labelText='Name'
						changeValue={handleChange}
						value={formData?.name}
					/>
					<InputWithLabel
						type='text'
						name='path'
						labelText='path'
						changeValue={handleChange}
						value={formData?.path}
					/>
				</div>
				<button
					className={style.navigationEdit_creating_add_button}
					onClick={handleCreateItem}
				>
					Add <ChevronRight />
				</button>
			</div>

			<div className={style.navigationEdit_list}>
				<div className={style.navigationEdit_list_item}>
					<span className={style.navigationEdit_list_item_name}>Home</span>
				</div>

				<div className={style.navigationEdit_list_item}>
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
								setNavigationItems={setItems}
								handleDeleteItem={() => handleDeleteItem(item._id)}
								handleDeleteChild={handleDeleteChild}
								BurgerIcon={BurgerIcon}
							/>
						))}
					</SortableContext>
				</DndContext>
			</div>
		</div>
	)
}

export { NavigationEdit }
