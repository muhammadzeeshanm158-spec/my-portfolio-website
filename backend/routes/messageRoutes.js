import express from 'express';
import {
    getAllMessages,
    createMessage,
    deleteMessage
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

// Express router initialize kar rahe hain contact messages endpoints ke liye
const router = express.Router();

// 1. GET Route: Portfolio ke Admin panel ke liye saare received messages fetch karne ke liye (Admin protected)
// YE PROTECTED HONA CHAHIYE - Public nahi
router.get('/', protect, getAllMessages);

// 2. POST Route: Portfolio website ke contact form se naya message submit karne ke liye (Public access for visitors)
// Ye public rahega taaki visitor message bhej sake
router.post('/', createMessage);

// 3. DELETE Route: Kisi specific message ko read karne ke baad delete karne ke liye (Admin protected)
router.delete('/:id', protect, deleteMessage);

export default router;