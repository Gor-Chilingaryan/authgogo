import React, { useState } from 'react'
import style from './homePage.module.css'
import { Navigation } from '../navigation/Navigation'

function HomePage() {
	return (
		<>
			<header className={style.header}>
				<Navigation />
			</header>
		</>
	)
}

export { HomePage }
