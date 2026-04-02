/**
 * Messenger page component.
 * Renders conversation list, active chat panel, and message composer UI.
 */
import React from 'react'
import { useMessenger } from './useMessenger'
import { Navigation } from '../main-page/navigation'
import style from './messenger.module.css'

/**
 * Displays the full messenger interface using `useMessenger`.
 * @returns {JSX.Element} Messenger screen layout.
 */
function Messenger() {
	const {
		conversations,
		activePartner,
		messages,
		messageInput,
		setMessageInput,
		searchQuery,
		setSearchQuery,
		searchResults,
		isSearching,
		isLoadingConversations,
		isLoadingMessages,
		isSending,
		error,
		messagesEndRef,
		openConversation,
		closeConversation,
		handleSend,
		handleKeyDown,
	} = useMessenger()

	return (
		<div className={style.page}>
			<header className={style.header}>
				<Navigation />
			</header>

			<main className={style.main}>
				{/* ── Left sidebar ── */}
				<aside className={style.sidebar}>
					<div className={style.sidebarHeader}>
						<h2 className={style.sidebarTitle}>Messages</h2>
					</div>

					{/* Search to start a new conversation */}
					<div className={style.searchWrapper}>
						<input
							type='text'
							className={style.searchInput}
							placeholder='Search people...'
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
						/>
					</div>

					{/* Search results */}
					{searchQuery && (
						<div className={style.searchResults}>
							{isSearching && <p className={style.searchHint}>Searching...</p>}
							{!isSearching && searchResults.length === 0 && (
								<p className={style.searchHint}>No users found</p>
							)}
							{searchResults.map(user => (
								<button
									key={user._id}
									className={style.searchResultItem}
									onClick={() => openConversation(user)}
								>
									<Avatar user={user} size={36} />
									<span className={style.searchResultName}>
										{user.firstName} {user.lastName}
									</span>
								</button>
							))}
						</div>
					)}

					{/* Conversation list */}
					<div className={style.conversationList}>
						{isLoadingConversations && <span className={style.loader} />}

						{!isLoadingConversations && conversations.length === 0 && (
							<p className={style.emptyHint}>
								No conversations yet. Search for someone above!
							</p>
						)}

						{conversations.map(({ user, lastMessage, unreadCount }) => (
							<button
								key={user._id}
								className={`${style.conversationItem} ${
									activePartner?._id === user._id
										? style.conversationItemActive
										: ''
								}`}
								onClick={() => openConversation(user)}
							>
								<div className={style.avatarWrapper}>
									<Avatar user={user} size={44} />
									{unreadCount > 0 && (
										<span className={style.badge}>
											{unreadCount > 9 ? '9+' : unreadCount}
										</span>
									)}
								</div>

								<div className={style.conversationMeta}>
									<span className={style.conversationName}>
										{user.firstName} {user.lastName}
									</span>
									{lastMessage && (
										<span className={style.lastMessage}>
											{lastMessage.content.length > 35
												? lastMessage.content.slice(0, 35) + '…'
												: lastMessage.content}
										</span>
									)}
								</div>

								{lastMessage && (
									<span className={style.conversationTime}>
										{formatTime(lastMessage.createdAt)}
									</span>
								)}
							</button>
						))}
					</div>
				</aside>

				{/* ── Chat panel ── */}
				<section className={style.chatPanel}>
					{!activePartner ? (
						<div className={style.emptyChat}>
							<div className={style.emptyChatIcon}>💬</div>
							<p className={style.emptyChatText}>
								Select a conversation or search for someone to start chatting
							</p>
						</div>
					) : (
						<>
							{/* Chat header */}
							<div className={style.chatHeader}>
								<button
									className={style.backButton}
									onClick={closeConversation}
								>
									←
								</button>
								<Avatar user={activePartner} size={40} />
								<div className={style.chatHeaderInfo}>
									<span className={style.chatHeaderName}>
										{activePartner.firstName} {activePartner.lastName}
									</span>
									<span className={style.chatHeaderEmail}>
										{activePartner.email}
									</span>
								</div>
							</div>

							{/* Messages */}
							<div className={style.messagesArea}>
								{isLoadingMessages && <span className={style.loader} />}

								{!isLoadingMessages && messages.length === 0 && (
									<p className={style.emptyHint}>No messages yet. Say hi! 👋</p>
								)}

								{messages.map(msg => {
									const isOwn = msg.sender._id !== activePartner._id
									return (
										<div
											key={msg._id}
											className={`${style.messageBubbleWrapper} ${
												isOwn ? style.ownWrapper : style.theirWrapper
											}`}
										>
											{!isOwn && <Avatar user={activePartner} size={28} />}
											<div
												className={`${style.messageBubble} ${
													isOwn ? style.ownBubble : style.theirBubble
												}`}
											>
												<p className={style.messageText}>{msg.content}</p>
												<span className={style.messageTime}>
													{formatTime(msg.createdAt)}
												</span>
											</div>
										</div>
									)
								})}

								{/* Invisible element at the bottom for auto-scroll */}
								<div ref={messagesEndRef} />
							</div>

							{/* Error toast */}
							{error && <div className={style.errorToast}>{error}</div>}

							{/* Input area */}
							<div className={style.inputArea}>
								<textarea
									className={style.messageInput}
									placeholder='Type a message… (Enter to send, Shift+Enter for new line)'
									value={messageInput}
									onChange={e => setMessageInput(e.target.value)}
									onKeyDown={handleKeyDown}
									rows={1}
									disabled={isSending}
								/>
								<button
									className={style.sendButton}
									onClick={handleSend}
									disabled={!messageInput.trim() || isSending}
								>
									{isSending ? '…' : '↑'}
								</button>
							</div>
						</>
					)}
				</section>
			</main>
		</div>
	)
}

// ── Small reusable avatar component ──────────────────────────────────────────

/**
 * Renders a circular user avatar image.
 * @param {{user: object, size: number}} props - Avatar props.
 * @returns {JSX.Element} Avatar image.
 */
function Avatar({ user, size }) {
	return (
		<img
			src={user.avatar || '/user-images/default_user.png'}
			alt={`${user.firstName} ${user.lastName}`}
			style={{
				width: size,
				height: size,
				borderRadius: '50%',
				objectFit: 'cover',
				flexShrink: 0,
			}}
		/>
	)
}

// ── Format timestamp ──────────────────────────────────────────────────────────

/**
 * Formats message timestamps for chat list and bubbles.
 * @param {string|Date} dateStr - Message creation timestamp.
 * @returns {string} Human-readable time or relative day.
 */
function formatTime(dateStr) {
	const date = new Date(dateStr)
	const now = new Date()
	const isToday = date.toDateString() === now.toDateString()

	if (isToday) {
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
	}

	const diffDays = Math.floor((now - date) / 86400000)
	if (diffDays === 1) return 'Yesterday'
	if (diffDays < 7) {
		return date.toLocaleDateString([], { weekday: 'short' })
	}
	return date.toLocaleDateString([], { day: 'numeric', month: 'short' })
}

export { Messenger }
