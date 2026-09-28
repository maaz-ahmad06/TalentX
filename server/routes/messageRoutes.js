import express from 'express';
import { getMessages, sendMessage, markAsRead } from '../controllers/messageController.js';

const router = express.Router();

router.route('/')
  .get(getMessages)
  .post(sendMessage);

router.put('/read/:senderId', markAsRead);

export default router;
