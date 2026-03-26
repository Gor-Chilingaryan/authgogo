import React, { useState } from 'react'
import style from '../../pages/main-page/navigation-edit/NavigationEdit.module.css'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import InputWithLabel from '../input-label/InputWithLabel'
import { createChildNavigation } from '../../api/requests/navigate'

function SortableItem({
	item,
	BurgerIcon,
	handleDeleteItem,
	handleDeleteChild,
	setNavigationItems,
}) {
	const [isOpen, setIsOpen] = useState(false)
	const [childForm, setChildForm] = useState({ name: '', path: '' })

	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: item._id })

	const initialStyle = {
		transform: CSS.Translate.toString(transform),
		transition,
	}

	const handleChildInputChange = e => {
		const { name, value } = e.target
		setChildForm(prev => ({ ...prev, [name]: value }))
	}

	const onAddChildCLick = async () => {
		if (!childForm.name || !childForm.path) return

		try {
			const response = await createChildNavigation(item._id, childForm)
			const updatedParent = response.json || response

			setNavigationItems(prev =>
				prev.map(nav => (nav._id === item._id ? updatedParent : nav)),
			)

			setChildForm({ name: '', path: '' })
			setIsOpen(false)
		} catch (error) {
			console.error('Failed to add child:', error)
		}
	}

	return (
		<div ref={setNodeRef} style={initialStyle}>
			<div className={style.navigationEdit_list_item}>
				<div {...attributes} {...listeners} style={{ cursor: 'grab' }}>
					<BurgerIcon />
				</div>
				<span className={style.navigationEdit_list_item_name}>{item.name}</span>
				<button
					className={` ${
						isOpen
							? style.navigationEdit_list_item_minus
							: style.navigationEdit_list_item_plus
					}`}
					onClick={() => setIsOpen(!isOpen)}
				>
					{isOpen ? <Minus /> : <Plus />}
				</button>

				<button
					className={style.navigationEdit__delete_item}
					onClick={handleDeleteItem}
				>
					X
				</button>
			</div>

			{item.childMenu && item.childMenu.length > 0 && (
				<div className={style.navigationEdit_child_list}>
					{item.childMenu.map(child => (
						<div key={child._id} className={style.navigationEdit_child_item}>
							<span className={style.child_name}>{child.name}</span>
							<button
								className={style.navigationEdit__delete_item}
								onClick={() => handleDeleteChild(item._id, child._id)}
							>
								X
							</button>
						</div>
					))}
				</div>
			)}

			{isOpen && (
				<div className={style.navigationEdit_list_item_children}>
					<div className={style.navigationEdit_list_item_children_input}>
						<InputWithLabel
							type='text'
							name='name'
							labelText='Name'
							changeValue={handleChildInputChange}
							value={childForm.name}
						/>
						<InputWithLabel
							type='text'
							name='path'
							labelText='Path'
							changeValue={handleChildInputChange}
							value={childForm.path}
						/>
					</div>
					<button
						className={style.navigationEdit_list_item_add_child}
						onClick={onAddChildCLick}
					>
						Add Child
					</button>
				</div>
			)}
		</div>
	)
}

const ArrowLeft = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		width='24'
		height='24'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'
	>
		<path d='m12 19-7-7 7-7' />
		<path d='M19 12H5' />
	</svg>
)

const ChevronRight = () => (
	<svg
		width='24'
		height='24'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'
	>
		<path d='m9 18 6-6-6-6' />
	</svg>
)

const BurgerIcon = ({ handleClose }) => (
	<svg
		width='24'
		height='24'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'
	>
		<line x1='4' y1='12' x2='20' y2='12'></line>
		<line x1='4' y1='6' x2='20' y2='6'></line>
		<line x1='4' y1='18' x2='20' y2='18'></line>
	</svg>
)

const Plus = () => (
	<svg
		width='25'
		height='25'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'
	>
		<line x1='12' y1='5' x2='12' y2='19'></line>
		<line x1='5' y1='12' x2='19' y2='12'></line>
	</svg>
)

const Minus = () => (
	<svg
		width='25'
		height='25'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'
	>
		<line x1='5' y1='12' x2='19' y2='12'></line>
	</svg>
)
export { SortableItem, ArrowLeft, ChevronRight, BurgerIcon }
