import * as subscriptionService from '../services/subscriptionService.js';
import { AppError } from '../middleware/errorHandler.js';

export const getMine = async (req, res) => {
  const subs = await subscriptionService.getMySubscriptions(req.user._id);
  res.json(subs);
};

export const listAll = async (req, res) => {
  const result = await subscriptionService.listAllSubscriptions(req.query);
  res.json(result);
};

export const create = async (req, res) => {
  if (req.user.role === 'admin') {
    throw new AppError('Admins cannot subscribe to plans', 403);
  }
  const planId = req.body.planId;
  if (!planId) throw new AppError('planId is required');
  const subscription = await subscriptionService.createSubscription(req.user._id, planId);
  res.status(201).json(subscription);
};

export const changePlan = async (req, res) => {
  if (req.user.role === 'admin') {
    throw new AppError('Admins cannot change subscriptions', 403);
  }
  const { planId } = req.body;
  if (!planId) throw new AppError('planId is required');
  const subscription = await subscriptionService.changePlan(
    req.params.id,
    req.user._id,
    planId
  );
  res.json(subscription);
};

export const cancel = async (req, res) => {
  const subscription = await subscriptionService.cancelSubscription(
    req.params.id,
    req.user._id,
    req.user.role === 'admin'
  );
  res.json(subscription);
};
