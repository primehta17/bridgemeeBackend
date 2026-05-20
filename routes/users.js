import express from 'express';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });

    const userIds = users.map((u) => u._id);
    const activeSubs = await Subscription.find({
      user: { $in: userIds },
      status: 'active',
      endDate: { $gte: new Date() },
    })
      .populate('plan')
      .sort({ createdAt: -1 });

    const subByUser = {};
    for (const sub of activeSubs) {
      const uid = sub.user.toString();
      if (!subByUser[uid]) subByUser[uid] = sub;
    }

    const result = users.map((u) => ({
      id: u._id,
      name: u.name,
      email: u.email,
      createdAt: u.createdAt,
      currentSubscription: subByUser[u._id.toString()] || null,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
