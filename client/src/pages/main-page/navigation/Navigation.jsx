import React from 'react'
import style from './navigation.module.css'
import { Link } from 'react-router-dom'

import penIcon from '../../../assets/icons/pen.svg'
import { useNavigation } from './useNavigation'

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
						const hasChildren = item.childMenu && item.childMenu.length > 0

						return (
							<div key={item._id} className={style.navItem}>
								<div className={style.navItemWrapper}>
									<Link to={item.path} className={style.navItemLink}>
										{item.name}
										{hasChildren && <ChevronDown />}
									</Link>

									{hasChildren && (
										<div className={style.dropDown}>
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
