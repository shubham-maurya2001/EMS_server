import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'
import { addLeave, getLeaves, getLeave, updateLeave } from '../controllers/leaveController.js';


const router = express.Router();


router.post('/add', authMiddleware, addLeave)
router.get('/:id', authMiddleware, getLeave)
router.get('/', authMiddleware, getLeaves)
router.put('/:id', authMiddleware, updateLeave)


export default router