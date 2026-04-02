/**
 * Home page component.
 * Composes authenticated layout with top navigation and user profile panel.
 */
import React, { useState } from 'react'
import style from './homePage.module.css'
import { Navigation } from '../navigation'
import { UserInfo } from '../user-info'
/**
 * Renders the main authenticated landing page.
 * @returns {JSX.Element} Home page layout.
 */
function HomePage() {
	return (
		<div className={style.homePage_container}>
			<header className={style.header}>
				<Navigation />
			</header>
			<main className={style.main}>
				<UserInfo />
			</main>
		</div>
	)
}

export { HomePage }
