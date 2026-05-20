import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as auditLogController from '../controllers/auditLogController.js';

const router = express.Router();

router.get('/', protect, adminOnly, asyncHandler(auditLogController.list));

export default router;
