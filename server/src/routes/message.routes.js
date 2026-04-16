import express from 'express'
import authMiddleware from '../middleware/auth.js'
import {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
  searchUsers,
} from '../controllers/message.controller.js'

const router = express.Router()

router.get('/messenger/conversations',  authMiddleware, getConversations)
router.get('/messenger/messages/:partnerId', authMiddleware, getMessages)
router.post('/messenger/messages/:partnerId', authMiddleware, sendMessage)
router.patch('/messenger/messages/:partnerId/read', authMiddleware, markAsRead)
router.get('/messenger/users/search', authMiddleware, searchUsers)

export default router
