import express from 'express';
import { getChats, createOrGetChat, sendMessage, markAsRead } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/chats', protect, getChats);
router.post('/chats', protect, createOrGetChat);
router.post('/chats/:chatId/messages', protect, sendMessage);
router.patch('/chats/:chatId/read', protect, markAsRead);

export default router;
