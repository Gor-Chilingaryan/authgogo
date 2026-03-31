import React, { useState, useEffect } from 'react'
import style from './messenger.module.css'
import { Navigation } from '../navigation/Navigation'
import { getUsers } from '../../../api/requests/chats'

function Messenger() {
	const [search, setSearch] = useState('')
	const [users, setUsers] = useState([]) // Результаты поиска
	const [activeChats, setActiveChats] = useState([]) // Список чатов в сайдбаре
	const [selectedChat, setSelectedChat] = useState(null) // Чат, открытый справа

	// Поиск пользователей
	useEffect(() => {
		if (search.trim()) {
			getUsers(search)
				.then(setUsers)
				.catch(() => console.log('User not found'))
		} else {
			setUsers([])
		}
	}, [search])

	const handleSearch = e => {
		setSearch(e.target.value)
	}
	console.log(activeChats)

	// Когда кликаем на юзера в поиске или в списке
	const handleChatSelect = user => {
		// 1. Добавляем в список активных, если его там нет
		setActiveChats(prev => {
			const exists = prev.find(u => u._id === user._id)
			if (!exists) return [user, ...prev]
			return prev
		})
		// 2. Делаем его активным в правом окне
		setSelectedChat(user)
		// 3. Очищаем поиск, чтобы закрыть оверлей
		setSearch('')
	}

	return (
		<div className={style.page_wrapper}>
			<Navigation />

			<div className={style.messenger_card}>
				{/* ЛЕВАЯ ЧАСТЬ - SIDEBAR */}
				<aside className={style.sidebar}>
					<div className={style.sidebar_header}>
						<h2 className={style.title}>Messages</h2>
						<div className={style.search_wrapper}>
							<input
								type='text'
								placeholder='Search'
								value={search}
								onChange={handleSearch}
							/>
							<div className={style.search_icon}>
								<SearchIcon />
							</div>
						</div>
					</div>

					<div className={style.chat_list_container}>
						{/* ОСНОВНОЙ СПИСОК ЧАТОВ */}
						<div className={style.active_chats_list}>
							{activeChats.length > 0 ? (
								activeChats.map(chat => (
									<div
										key={chat._id}
										className={`${style.chat_item} ${
											selectedChat?._id === chat._id ? style.active : ''
										}`}
										onClick={() => setSelectedChat(chat)}
									>
										<img
											src={chat.avatar}
											alt='avatar'
											className={style.avatar}
										/>
										{/* ..... */}
										<div className={style.chat_info}>
											<h4>{`${chat.firstName} ${chat.lastName}`}</h4>
											<p>Click to view messages...</p>
										</div>
										<span className={style.unread_badge}>1</span>
									</div>
								))
							) : (
								<p className={style.empty_text}>No active conversations</p>
							)}
						</div>

						{/* ОВЕРЛЕЙ ПОИСКА (Появляется когда пишешь) */}
						{search && (
							<div className={style.search_overlay}>
								{users.length > 0 ? (
									users.map(user => (
										<div
											key={user._id}
											className={style.search_result_item}
											onClick={() => handleChatSelect(user)}
										>
											<img
												src={user.avatar}
												alt='avatar'
												className={style.avatar}
											/>
											<div className={style.chat_info}>
												<h4>{`${user.firstName} ${user.lastName}`}</h4>
												<p>Found in global search</p>
											</div>
										</div>
									))
								) : (
									<div className={style.empty_text}>No users found</div>
								)}
							</div>
						)}
					</div>
				</aside>

				{/* ПРАВАЯ ЧАСТЬ - CHAT WINDOW */}
				<main className={style.chat_window}>
					{selectedChat ? (
						<>
							<header className={style.chat_header}>
								<img
									src={selectedChat.avatar}
									alt='avatar'
									className={style.avatar}
								/>
								<h3>{`${selectedChat.firstName} ${selectedChat.lastName}`}</h3>
							</header>

							<div className={style.messages_area}>
								<div className={style.message_received}>
									Hello! How are you?
								</div>
								<div className={style.message_sent}>
									I'm good, thanks! Check this out.
								</div>
								<div className={style.message_received}>Looks amazing.</div>
							</div>

							<footer className={style.chat_footer}>
								<input
									type='text'
									placeholder='Type something...'
									className={style.message_input}
								/>
								<button className={style.send_button}>SEND</button>
							</footer>
						</>
					) : (
						<div className={style.no_chat_selected}>
							<p>Select a message to start chatting</p>
						</div>
					)}
				</main>
			</div>
		</div>
	)
}

export { Messenger }

function SearchIcon() {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={16}
			height={16}
			viewBox='0 0 24 24'
			fill='none'
			stroke='#999'
			strokeWidth={2}
			strokeLinecap='round'
			strokeLinejoin='round'
		>
			<circle cx='11' cy='11' r='8' />
			<line x1='21' y1='21' x2='16.65' y2='16.65' />
		</svg>
	)
}
