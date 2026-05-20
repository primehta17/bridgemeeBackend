import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

router.get('/', protect, adminOnly, asyncHandler(userController.list));

export default router;
