import { useEffect, useRef, useState, useCallback } from 'react'
import { io } from 'socket.io-client'
import {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
  searchUsers,
} from '@features/conversations/services/messages.js'
import { getUserInfoRequest } from '@features/home-page/services/userInfo'

const SOCKET_URL = import.meta.env.VITE_API_URL

export function useMessenger(currentUserId) {
  const [resolvedUserId, setResolvedUserId] = useState(currentUserId || null)
  const [conversations, setConversations] = useState([])
  const [activePartner, setActivePartner] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const [isSearching, setIsSearching] = useState(false)
  const [isLoadingConversations, setIsLoadingConversations] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState(null)

  const messagesEndRef = useRef(null)

  const socketRef = useRef(null)

  const activePartnerRef = useRef(activePartner)

  useEffect(() => {
    activePartnerRef.current = activePartner
  }, [activePartner])

  const logMarkAsReadError = useCallback((err, context) => {
    // High-signal debug info for Axios (500s, payload, etc.)
    const status = err?.response?.status
    const statusText = err?.response?.statusText
    const responseData = err?.response?.data
    const method = err?.config?.method
    const url = err?.config?.url

    console.error('markAsRead failed:', {
      context,
      message: err?.message,
      status,
      statusText,
      method,
      url,
      responseData,
    })
  }, [])

  useEffect(() => {
    let cancelled = false

    if (currentUserId) {
      setResolvedUserId(currentUserId)
      return
    }

    ; (async () => {
      try {
        const me = await getUserInfoRequest()
        const id = me?._id
        if (!cancelled && id) setResolvedUserId(id)
      } catch (err) {
        console.error(err)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [currentUserId])

  useEffect(() => {
    if (!resolvedUserId) return

    socketRef.current = io(SOCKET_URL, {
      query: { userId: resolvedUserId },
      transports: ['websocket'],
    })

    socketRef.current.on('receive_message', (newMsg) => {
      const currentActive = activePartnerRef.current

      const isFromActive = currentActive &&
        (newMsg.sender._id === currentActive._id || newMsg.receiver._id === currentActive._id)

      if (isFromActive) {
        setMessages((prev) => [...prev, newMsg])
        if (newMsg.sender._id === currentActive._id) {
          (async () => {
            try {
              await markAsRead(currentActive._id)
            } catch (err) {
              logMarkAsReadError(err, { where: 'socket:receive_message', partnerId: currentActive._id })
            }
          })()
        }
      }

      setConversations((prev) => {
        const partnerId = newMsg.sender._id === resolvedUserId ? newMsg.receiver._id : newMsg.sender._id
        const existing = prev.find((c) => c.user._id === partnerId)

        const updateConv = {
          user: existing ? existing.user : (newMsg.sender._id === resolvedUserId ? newMsg.receiver : newMsg.sender),
          lastMessage: newMsg,
          unreadCount: (existing?.unreadCount || 0) +
            (newMsg.sender._id !== resolvedUserId && (!currentActive || currentActive._id !== partnerId) ? 1 : 0)
        }
        return [updateConv, ...prev.filter(c => c.user._id !== partnerId)]
      })
    })
    return () => {
      socketRef.current?.disconnect()
    }
  }, [resolvedUserId, logMarkAsReadError])

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

  const fetchMessages = useCallback(async (partnerId,) => {
    if (!partnerId) return
    try {
      setIsLoadingMessages(true)
      const data = await getMessages(partnerId)
      setMessages(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoadingMessages(false)
    }
  }, [])


  const openConversation = useCallback(
    async (partner) => {
      setActivePartner(partner)
      setSearchQuery('')
      setSearchResults([])
      setMessages([])
      setError(null)

      if (partner) {
        await fetchMessages(partner._id);
        (async () => {
          try {
            await markAsRead(partner._id)
            setConversations(prev =>
              prev.map(conv =>
                conv.user._id === partner._id ? { ...conv, unreadCount: 0 } : conv
              )
            )
          } catch (err) {
            logMarkAsReadError(err, { where: 'openConversation', partnerId: partner._id })
          }
        })()
      }
    }, [fetchMessages, logMarkAsReadError]
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = useCallback(async () => {
    const content = messageInput.trim()
    if (!content || !activePartner || isSending) return

    try {
      setIsSending(true)
      setError(null)

      const newMsg = await sendMessage(activePartner._id, content)

      setMessageInput('')
      setMessages(prev => [...prev, newMsg])

      setConversations(prev => {
        const updateConv = {
          user: activePartner,
          lastMessage: newMsg,
          unreadCount: 0
        }
        return [updateConv, ...prev.filter(c => c.user._id !== activePartner._id)]
      })
    } catch (err) {
      console.error( err) 
      setError('Failed to send message')
    } finally {
      setIsSending(false)
    }
  }, [messageInput, activePartner, isSending])
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

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

  function formatTime(dataStr) {
    const data = new Date(dataStr)
    const now = new Date()
    if (data.toDateString() === now.toDateString()) {
      return data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    return data.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return {
    openConversation,
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
    formatTime,
    handleSend,
    handleKeyDown,
  }
}
