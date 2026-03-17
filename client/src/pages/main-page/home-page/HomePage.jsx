import React, { useState } from 'react'
import style from './homePage.module.css'
import { Navigation } from '../navigation/Navigation'
import {UserInfo} from '../user-info/UserInfo'

function HomePage() {
	return (
		<>
			<header className={style.header}>
				<Navigation />
			</header>
			<main className={style.main}>
				<UserInfo />
			</main>
		</>
	)
}

export { HomePage }
