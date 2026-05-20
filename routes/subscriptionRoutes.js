import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as subscriptionController from '../controllers/subscriptionController.js';

const router = express.Router();

router.get('/me', protect, asyncHandler(subscriptionController.getMine));
router.get('/mine', protect, asyncHandler(subscriptionController.getMine));
router.get('/', protect, adminOnly, asyncHandler(subscriptionController.listAll));
router.post('/', protect, asyncHandler(subscriptionController.create));
router.patch('/:id/change-plan', protect, asyncHandler(subscriptionController.changePlan));
router.patch('/:id/cancel', protect, asyncHandler(subscriptionController.cancel));

export default router;
