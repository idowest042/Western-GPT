import express from 'express';
import { checkAuth, login, logout, register } from '../Controller/gptController.js';
import { GetMessageById, SendMessage,createChat, getUserChats, updateChatTitle } from '../Controller/SendGpt.js';
import { protectRoute } from '../Middleware/authMiddleware.js';
const router = express.Router();
router.post('/signup',register)
router.post('/login', login);
router.post('/logout',logout)
router.post('/send/:chatId', SendMessage);
router.get('/messages/:chatId',protectRoute, GetMessageById)
router.post("/create",protectRoute, createChat);
router.get('/check',protectRoute,checkAuth)
router.get('/chats',protectRoute, getUserChats)
router.patch('/chats/:id',protectRoute,updateChatTitle)
export default router;