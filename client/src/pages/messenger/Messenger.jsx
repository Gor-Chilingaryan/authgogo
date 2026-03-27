import React from 'react'
import style from './messenger.module.css'
import InputWithLabel from '../../components/input-label/InputWithLabel'

function Messenger() {
	return (
		<div className={style.messenger_container}>
			<div className={style.messenger_right_side}>
				<div className={style.messenger_right_side_header}>
					<h2 className={style.messenger_right_side_header_title}>Messenger</h2>
				</div>
				<div className={style.messenger_right_side_search}>
					<InputWithLabel
						type='text'
						name='search'
						placeholder='Search'
						// value={search}
						// onChange={handleSearch}
					/>
					<SearchIcon />
				</div>
			</div>
		</div>
	)
}

export { Messenger }


function SearchIcon() {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			fill='none'
			stroke={'currentColor'}
			strokeWidth={2}
			strokeLinecap='round'
			strokeLinejoin='round'
			style={{ cursor: 'pointer' }}
		>
			<circle cx='11' cy='11' r='8' />
			<line x1='21' y1='21' x2='16.65' y2='16.65' />
		</svg>
	)
}
