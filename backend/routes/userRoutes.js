import express from 'express';
import { getAllUsers, getUserProfile, updateProfile, toggleConnection } from '../controllers/userController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/users', protect, getAllUsers);
router.get('/users/:username', optionalAuth, getUserProfile);
router.patch('/users/me', protect, updateProfile);
router.post('/users/:userId/connect', protect, toggleConnection);

export default router;
