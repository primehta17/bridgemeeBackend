import Subscription from '../models/Subscription.js';
import Plan from '../models/Plan.js';
import { AppError } from '../middleware/errorHandler.js';
import { parsePagination, paginatedResponse } from '../utils/pagination.js';

const addMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

const cycleMonths = (billingCycle) => (billingCycle === 'annual' ? 12 : 1);

export const expireStale = async (userId) => {
  await Subscription.updateMany(
    { userId, status: 'active', endDate: { $lt: new Date() } },
    { status: 'expired', updatedBy: userId }
  );
};

export const getMySubscriptions = async (userId) => {
  await expireStale(userId);
  return Subscription.find({ userId }).populate('planId').sort({ createdAt: -1 });
};

export const listAllSubscriptions = async (query = {}) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.userId) filter.userId = query.userId;

  const [items, total] = await Promise.all([
    Subscription.find(filter)
      .populate('userId', 'name email')
      .populate('planId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Subscription.countDocuments(filter),
  ]);

  return paginatedResponse(items, total, page, limit);
};

export const createSubscription = async (userId, planId) => {
  const plan = await Plan.findOne({ _id: planId, isActive: true });
  if (!plan) throw new AppError('Plan not found or inactive', 404);

  await expireStale(userId);

  const active = await Subscription.findOne({
    userId,
    status: 'active',
    endDate: { $gte: new Date() },
  });
  if (active) {
    throw new AppError(
      'You already have an active subscription. Cancel it or use change-plan to switch.'
    );
  }

  const startDate = new Date();
  const endDate = addMonths(startDate, cycleMonths(plan.billingCycle));
  const subscription = await Subscription.create({
    userId,
    planId: plan._id,
    startDate,
    endDate,
    nextBillingDate: endDate,
    status: 'active',
    createdBy: userId,
    updatedBy: userId,
  });

  await subscription.populate('planId');
  return subscription;
};

export const changePlan = async (subscriptionId, userId, newPlanId) => {
  const subscription = await Subscription.findOne({
    _id: subscriptionId,
    userId,
    status: 'active',
    endDate: { $gte: new Date() },
  });
  if (!subscription) {
    throw new AppError('Active subscription not found', 404);
  }

  const plan = await Plan.findOne({ _id: newPlanId, isActive: true });
  if (!plan) throw new AppError('Plan not found or inactive', 404);

  if (subscription.planId.toString() === plan._id.toString()) {
    throw new AppError('You are already on this plan');
  }

  const startDate = new Date();
  subscription.planId = plan._id;
  subscription.startDate = startDate;
  subscription.endDate = addMonths(startDate, cycleMonths(plan.billingCycle));
  subscription.nextBillingDate = subscription.endDate;
  subscription.updatedBy = userId;
  await subscription.save();
  await subscription.populate('planId');
  return subscription;
};

export const cancelSubscription = async (subscriptionId, userId, isAdmin = false) => {
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) throw new AppError('Subscription not found', 404);

  if (!isAdmin && subscription.userId.toString() !== userId.toString()) {
    throw new AppError('Not allowed', 403);
  }
  if (subscription.status !== 'active') {
    throw new AppError('Subscription is not active');
  }

  subscription.status = 'cancelled';
  subscription.cancelledAt = new Date();
  subscription.updatedBy = userId;
  await subscription.save();
  await subscription.populate('planId');
  return subscription;
};
