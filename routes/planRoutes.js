import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { optionalAuth } from '../middleware/optionalAuth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as planController from '../controllers/planController.js';

const router = express.Router();

router.get('/', optionalAuth, asyncHandler(planController.list));
router.get('/:id', optionalAuth, asyncHandler(planController.getOne));
router.post('/', protect, adminOnly, asyncHandler(planController.create));
router.put('/:id', protect, adminOnly, asyncHandler(planController.update));
router.delete('/:id', protect, adminOnly, asyncHandler(planController.remove));

export default router;
