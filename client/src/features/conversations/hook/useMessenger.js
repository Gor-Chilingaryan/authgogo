/**
 * Messenger state hook.
 * Encapsulates conversation list, active chat state, polling, message sending, and search flow.
 */
import { useEffect, useRef, useState, useCallback } from 'react'
import {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
  searchUsers,
} from '@features/conversations/services/messages.js'

const POLL_INTERVAL = import.meta.env.VITE_POLL_INTERVAL // poll for new messages every 3 seconds

/**
 * Provides all state and handlers required by the Messenger page.
 * @returns {{
 * conversations: Array,
 * activePartner: object|null,
 * messages: Array,
 * messageInput: string,
 * setMessageInput: Function,
 * searchQuery: string,
 * setSearchQuery: Function,
 * searchResults: Array,
 * isSearching: boolean,
 * isLoadingConversations: boolean,
 * isLoadingMessages: boolean,
 * isSending: boolean,
 * error: string|null,
 * messagesEndRef: import('react').MutableRefObject<HTMLElement|null>,
 * openConversation: Function,
 * handleSend: Function,
 * handleKeyDown: Function
 * }} Hook API for messenger UI.
 */
export function useMessenger() {
  const [conversations, setConversations] = useState([])
  const [activePartner, setActivePartner] = useState(null) // the user we're chatting with
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const [isSearching, setIsSearching] = useState(false)
  const [isLoadingConversations, setIsLoadingConversations] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState(null)

  const messagesEndRef = useRef(null) // for auto-scroll to bottom
  const pollRef = useRef(null)        // interval ref for cleanup
  const activePartnerRef = useRef(null) // keep ref in sync for use inside interval

  // Keep the ref in sync with the state
  useEffect(() => {
    activePartnerRef.current = activePartner
  }, [activePartner])

  // ─── Load conversations ───────────────────────────────────────────────────

  /**
   * Loads all conversations for current user.
   * @returns {Promise<void>} Updates local conversation state.
   */
  const fetchConversations = useCallback(async () => {
    try {
      setIsLoadingConversations(true)
      const data = await getConversations()
      setConversations(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoadingConversations(false)
    }
  }, [])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  // ─── Load messages for the active conversation ────────────────────────────

  /**
   * Loads messages for one conversation.
   * @param {string} partnerId - Conversation partner id.
   * @param {boolean} [silent=false] - If true, skips loading state and merges data.
   * @returns {Promise<void>} Updates message state.
   */
  const fetchMessages = useCallback(async (partnerId, silent = false) => {
    if (!partnerId) return
    try {
      if (!silent) setIsLoadingMessages(true)
      const data = await getMessages(partnerId)
      if (!Array.isArray(data)) return

      if (silent) {
        // During polling: merge instead of replacing so optimistic messages
        // don't disappear if the poll fires before the server has persisted them
        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m._id))
          const incoming = data.filter(m => !existingIds.has(m._id))
          return incoming.length > 0 ? [...prev, ...incoming] : prev
        })
      } else {
        setMessages(data)
      }
    } catch (err) {
      if (!silent) setError(err.message)
    } finally {
      if (!silent) setIsLoadingMessages(false)
    }
  }, [])

  // ─── Poll for new messages every 3s when a conversation is open ──────────

  /**
   * Starts background polling for new messages.
   * @returns {void}
   */
  const startPolling = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current)

    pollRef.current = setInterval(async () => {
      const partner = activePartnerRef.current
      if (!partner) return
      await fetchMessages(partner._id, true) // silent = no loading spinner
    }, POLL_INTERVAL)
  }, [fetchMessages])

  /**
   * Stops active polling interval.
   * @returns {void}
   */
  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => stopPolling()
  }, [stopPolling])

  // ─── Open a conversation ──────────────────────────────────────────────────

  /**
   * Opens a conversation and marks unread partner messages as read.
   * @param {object} partner - Selected user object.
   * @returns {Promise<void>} Loads conversation data and starts polling.
   */
  const openConversation = useCallback(
    async (partner) => {
      stopPolling()
      setActivePartner(partner)
      setSearchQuery('')
      setSearchResults([])
      setMessages([])
      setError(null)

      await fetchMessages(partner._id)

      // Mark incoming messages as read
      try {
        await markAsRead(partner._id)
        // Update unread badge locally
        setConversations(prev =>
          prev.map(conv =>
            conv.user._id === partner._id
              ? { ...conv, unreadCount: 0 }
              : conv
          )
        )
      } catch {
        // Non-critical — ignore
      }

      startPolling()
    },
    [fetchMessages, startPolling, stopPolling]
  )

  // ─── Auto-scroll to bottom when messages change ───────────────────────────

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ─── Send a message ───────────────────────────────────────────────────────

  /**
   * Sends the current draft message to active partner.
   * @returns {Promise<void>} Adds sent message to local state.
   */
  const handleSend = useCallback(async () => {
    const content = messageInput.trim()
    if (!content || !activePartner || isSending) return

    try {
      setIsSending(true)
      setError(null)
      setMessageInput('')
      const newMsg = await sendMessage(activePartner._id, content)

      // Append immediately — don't wait for the poll
      setMessages(prev => [...prev, newMsg])

      // Bump this conversation to the top of the list (or add it if new)
      setConversations(prev => {
        const exists = prev.find(c => c.user._id === activePartner._id)
        const updatedConv = {
          user: activePartner,
          lastMessage: newMsg,
          unreadCount: 0,
        }
        if (exists) {
          return [
            updatedConv,
            ...prev.filter(c => c.user._id !== activePartner._id),
          ]
        }
        return [updatedConv, ...prev]
      })
    } catch (err) {
      setError('Failed to send message')
      setMessageInput(content) // restore the input so user doesn't lose their text
    } finally {
      setIsSending(false)
    }
  }, [messageInput, activePartner, isSending])

  // Send on Enter (Shift+Enter = newline)
  /**
   * Handles textarea keyboard shortcuts for sending.
   * @param {KeyboardEvent} e - Keydown event from textarea.
   * @returns {void}
   */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  // ─── Search users ─────────────────────────────────────────────────────────

  // Debounce: wait 400ms after typing stops before hitting the server
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true)
        const results = await searchUsers(searchQuery)
        setSearchResults(Array.isArray(results) ? results : [])
      } catch {
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // ── Format timestamp ──────────────────────────────────────────────────────────

  /**
   * Formats message timestamps for chat list and bubbles.
   * @param {string|Date} dateStr - Message creation timestamp.
   * @returns {string} Human-readable time or relative day.
   */
  function formatTime(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const diffDays = Math.floor((now - date) / 86400000);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
  }


  return {
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

  }
}
