/**
 * Messenger page component.
 * Renders conversation list, active chat panel, and message composer UI.
 */
import React from 'react';
import style from './messenger.module.css';
import { useMessenger } from '@features/conversations/hook/useMessenger';
import { Avatar } from '@/components/user-avatar-modal';
import loupeIcon from '@assets/icons/loupe.svg';

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
    formatTime,
    handleSend,
    handleKeyDown,
  } = useMessenger();

  const closeChat = () => openConversation(null);

  return (
    <div className={style.page}>
      <main className={style.main}>
        {/* ── Left sidebar ── */}
        <aside
          className={`${style.sidebar} ${activePartner ? style.hiddenOnMobile : ''}`}
        >
          <div className={style.sidebarHeader}>
            <h2 className={style.sidebarTitle}>Messages</h2>
          </div>

          {/* Search to start a new conversation */}
          <div className={style.searchWrapper}>
            <input
              type='text'
              className={style.searchInput}
              placeholder='Search '
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className={style.searchUserInfo}>
              <img src={loupeIcon} alt='loupe' />
            </button>
          </div>

          {/* Search results */}
          {searchQuery && (
            <div className={style.searchResults}>
              {isSearching && <p className={style.searchHint}>Searching...</p>}
              {!isSearching && searchResults.length === 0 && (
                <p className={style.searchHint}>No users found</p>
              )}
              {searchResults.map((user) => (
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
              </button>
            ))}
          </div>
        </aside>

        {/* ── Chat panel ── */}
        <section
          className={`${style.chatPanel} ${!activePartner ? style.hiddenOnMobile : ''}`}
        >
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
                <button className={style.backButton} onClick={closeChat}>
                  ←
                </button>
                <Avatar user={activePartner} size={40} />
                <div className={style.chatHeaderInfo}>
                  <span className={style.chatHeaderName}>
                    {activePartner.firstName} {activePartner.lastName}
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className={style.messagesArea}>
                {isLoadingMessages && <span className={style.loader} />}

                {!isLoadingMessages && messages.length === 0 && (
                  <p className={style.emptyHint}>No messages yet. Say hi! 👋</p>
                )}

                {messages.map((msg) => {
                  const isOwn = msg.sender._id !== activePartner._id;
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
                  );
                })}

                <div ref={messagesEndRef} />
              </div>

              {/* Error toast */}
              {error && <div className={style.errorToast}>{error}</div>}

              {/* Input area */}
              <div className={style.inputArea}>
                <div className={style.inputWrapper}>
                  <textarea
                    className={style.messageInput}
                    placeholder='Type a message…'
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    disabled={isSending}
                  />
                  <button
                    className={style.sendButton}
                    onClick={handleSend}
                    disabled={!messageInput.trim() || isSending}
                  >
                    SEND
                  </button>
                </div>
              </div>
              <div>
                <button className={style.addUserInfo}>
                  Share my account details
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export { Messenger };
