import React from 'react'
import style from './navigation.module.css'
import { Link } from 'react-router-dom'

import penIcon from '../../../assets/icons/pen.svg'
import { useNavigation } from './useNavigation'

function Navigation() {
	const { navItems, error } = useNavigation()
	if (error) return <div>{error}</div>

	return (
		<div className={style.navigation_container}>
			<div className={style.navItems_container}>
				{navItems.map(({ _id, name, path }) => {
					return (
						<div key={_id} className={style.navItem}>
							<Link to={path} className={style.navItemLink}>
								{name}
							</Link>
						</div>
					)
				})}
			</div>
			<button className={style.editButton}>
				<img src={penIcon} alt='Editer icon' />
			</button>
		</div>
	)
}

export { Navigation }
