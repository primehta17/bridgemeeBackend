import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import { parsePagination, paginatedResponse } from '../utils/pagination.js';

const buildUserFilter = (query) => {
  const filter = { role: 'user' };
  const q = query.q?.trim();
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
    ];
  }
  return filter;
};

export const listUsers = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = buildUserFilter(query);

  const [users, total] = await Promise.all([
    User.find(filter).select('-passwordHash').sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  const userIds = users.map((u) => u._id);
  const activeSubs = await Subscription.find({
    userId: { $in: userIds },
    status: 'active',
    endDate: { $gte: new Date() },
  })
    .populate('planId')
    .sort({ createdAt: -1 });

  const subByUser = {};
  for (const sub of activeSubs) {
    const uid = sub.userId.toString();
    if (!subByUser[uid]) subByUser[uid] = sub;
  }

  let items = users.map((u) => ({
    id: u._id,
    name: u.name,
    email: u.email,
    createdAt: u.createdAt,
    currentSubscription: subByUser[u._id.toString()] || null,
  }));

  if (query.hasActivePlan === 'true') {
    items = items.filter((u) => u.currentSubscription);
  } else if (query.hasActivePlan === 'false') {
    items = items.filter((u) => !u.currentSubscription);
  }

  return paginatedResponse(items, total, page, limit);
};
