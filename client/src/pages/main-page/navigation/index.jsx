/**
 * Top navigation component.
 * Renders static and user-defined navigation links with optional child dropdowns.
 */
import React from 'react'
import style from './navigation.module.css'
import { Link } from 'react-router-dom'

import penIcon from '../../../assets/icons/pen.svg'
import { useNavigation } from './useNavigation'

/**
 * Displays the main app navigation bar.
 * @returns {JSX.Element} Navigation header UI.
 */
function Navigation() {
	const { navItems, error, isLoading, handleEditNavigation } = useNavigation()

	if (isLoading) return <span className={style.loader}></span>
	if (error) return <div className={style.error}>{error}</div>

	return (
		<div className={style.navigation_container}>
			<div className={style.navItems_container}>
				<div className={style.navItem}>
					<Link to={'/homepage'} className={style.navItemLink}>
						Home
					</Link>
				</div>
				<div className={style.navItem}>
					<Link to={'/messenger'} className={style.navItemLink}>
						Messenger
					</Link>
				</div>

				{Array.isArray(navItems) &&
					navItems.map(item => {
						// Child links are rendered as dropdown when at least one child exists.
						const hasChildren = item.childMenu && item.childMenu.length > 0

						return (
							<div key={item._id} className={style.navItem}>
								{/* Wrapper keeps parent link and dropdown hover state connected. */}
								<div className={style.navItemWrapper}>
									<Link to={item.path} className={style.navItemLink}>
										{item.name}
										{hasChildren && <ChevronDown />}
									</Link>

									{hasChildren && (
										<div className={style.dropDown}>
											{/* Render all nested child links for this parent item. */}
											{item.childMenu.map(child => (
												<Link
													to={child.path}
													className={style.dropDownLink}
													key={child._id}
												>
													{child.name}
												</Link>
											))}
										</div>
									)}
								</div>
							</div>
						)
					})}
			</div>
			<button className={style.editButton} onClick={handleEditNavigation}>
				<img src={penIcon} alt='Edit icon' />
			</button>
		</div>
	)
}

/**
 * Chevron icon for dropdown-capable navigation items.
 * @returns {JSX.Element} SVG icon.
 */
function ChevronDown() {
	return (
		<svg
			width='12'
			height='12'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='3'
			strokeLinecap='round'
			strokeLinejoin='round'
			className={style.chevron}
		>
			<path d='m6 9 6 6 6-6' />
		</svg>
	)
}

export { Navigation }
