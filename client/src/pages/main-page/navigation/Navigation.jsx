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
					navItems.map(({ _id, name, path }) => {
						return (
							<div key={_id} className={style.navItem}>
								<Link to={path} className={style.navItemLink}>
									{name}
								</Link>
							</div>
						)
					})}
			</div>
			<button className={style.editButton} onClick={handleEditNavigation}>
				<img src={penIcon} alt='Editer icon' />
			</button>
		</div>
	)
}

export { Navigation }
