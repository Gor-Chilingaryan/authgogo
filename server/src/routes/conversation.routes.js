import express from 'express';
import {
  createConversationController,
  getAllConversationsController
} from '../controllers/conversation.controller.js';

const router = express.Router();

// POST: Создать чат (тело: { senderId, receiverId })
router.post('/', createConversationController);

// GET: Получить все чаты юзера по его ID
router.get('/:userId', getAllConversationsController);

export default router;