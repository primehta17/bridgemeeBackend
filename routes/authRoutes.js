import express from 'express';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));
router.post('/refresh', asyncHandler(authController.refresh));
router.post('/logout', protect, asyncHandler(authController.logout));
router.get('/me', protect, asyncHandler(authController.me));

export default router;
