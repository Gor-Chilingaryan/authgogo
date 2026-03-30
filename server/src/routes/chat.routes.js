import express from 'express'
import authMiddleware from '../middleware/auth.js'
import { sendMessage, getConversation, getMessages } from '../controllers/chat.contoller.js'

const router = express.Router()

router.get('/conversations', authMiddleware, getConversation)
router.get('/messages/:partnerId', authMiddleware, getMessages)
router.post('/send-message', authMiddleware, sendMessage)

export default router