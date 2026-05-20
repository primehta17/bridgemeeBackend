import express from 'express';
import Subscription from '../models/Subscription.js';
import Plan from '../models/Plan.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

const addMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

const expireStale = async (userId) => {
  await Subscription.updateMany(
    {
      user: userId,
      status: 'active',
      endDate: { $lt: new Date() },
    },
    { status: 'expired' }
  );
};

router.get('/mine', protect, async (req, res) => {
  try {
    await expireStale(req.user._id);
    const subs = await Subscription.find({ user: req.user._id })
      .populate('plan')
      .sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const subs = await Subscription.find()
      .populate('user', 'name email')
      .populate('plan')
      .sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      return res.status(403).json({ message: 'Admins cannot subscribe to plans' });
    }

    const { planId } = req.body;
    if (!planId) return res.status(400).json({ message: 'planId is required' });

    const plan = await Plan.findOne({ _id: planId, isActive: true });
    if (!plan) return res.status(404).json({ message: 'Plan not found or inactive' });

    await expireStale(req.user._id);

    const active = await Subscription.findOne({
      user: req.user._id,
      status: 'active',
      endDate: { $gte: new Date() },
    });
    if (active) {
      return res.status(400).json({
        message: 'You already have an active subscription. Cancel it before subscribing to another plan.',
      });
    }

    const startDate = new Date();
    const endDate = addMonths(startDate, plan.durationMonths);

    const subscription = await Subscription.create({
      user: req.user._id,
      plan: plan._id,
      startDate,
      endDate,
      status: 'active',
    });

    await subscription.populate('plan');
    res.status(201).json(subscription);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/cancel', protect, async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });

    if (
      req.user.role !== 'admin' &&
      subscription.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    if (subscription.status !== 'active') {
      return res.status(400).json({ message: 'Subscription is not active' });
    }

    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    await subscription.save();
    await subscription.populate('plan');

    res.json(subscription);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
