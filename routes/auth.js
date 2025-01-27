import express from 'express';
import { resetPassword, login, verify } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login)
router.get('/verify', authMiddleware, verify)
router.post('/reset-password', resetPassword)

export default router;