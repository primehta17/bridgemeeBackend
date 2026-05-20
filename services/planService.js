import Plan from '../models/Plan.js';
import { parsePagination, paginatedResponse } from '../utils/pagination.js';
import { AppError } from '../middleware/errorHandler.js';

const buildAdminFilter = (query) => {
  const filter = {};
  const q = query.q?.trim();
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
    ];
  }
  if (query.isActive != null && query.isActive !== '') {
    filter.isActive = query.isActive === 'true';
  }
  if (query.billingCycle) {
    filter.billingCycle = query.billingCycle;
  }
  if (query.minPrice != null) filter.price = { ...filter.price, $gte: Number(query.minPrice) };
  if (query.maxPrice != null) filter.price = { ...filter.price, $lte: Number(query.maxPrice) };
  return filter;
};

export const listActivePlans = async () =>
  Plan.find({ isActive: true }).sort({ price: 1 });

export const listAdminPlans = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = buildAdminFilter(query);
  const sort = query.sort === 'price' ? { price: 1 } : { createdAt: -1 };

  const [items, total] = await Promise.all([
    Plan.find(filter).sort(sort).skip(skip).limit(limit),
    Plan.countDocuments(filter),
  ]);

  return paginatedResponse(items, total, page, limit);
};

export const getPlanById = async (id, { admin = false } = {}) => {
  const plan = await Plan.findById(id);
  if (!plan) throw new AppError('Plan not found', 404);
  if (!plan.isActive && !admin) throw new AppError('Plan not found', 404);
  return plan;
};

export const createPlan = async (body, userId) => {
  const { name, description, price, billingCycle, features, isActive } = body;
  if (!name?.trim() || price == null || !billingCycle) {
    throw new AppError('Name, price, and billingCycle are required');
  }

  return Plan.create({
    name: name.trim(),
    description: description?.trim() || '',
    price: Number(price),
    billingCycle,
    features: Array.isArray(features) ? features.filter(Boolean) : [],
    isActive: isActive !== false,
    createdBy: userId,
    updatedBy: userId,
  });
};

export const updatePlan = async (id, body, userId) => {
  const plan = await Plan.findByIdAndUpdate(
    id,
    {
      ...(body.name != null && { name: body.name.trim() }),
      ...(body.description != null && { description: body.description.trim() }),
      ...(body.price != null && { price: Number(body.price) }),
      ...(body.billingCycle != null && { billingCycle: body.billingCycle }),
      ...(body.features != null && {
        features: Array.isArray(body.features) ? body.features.filter(Boolean) : [],
      }),
      ...(body.isActive != null && { isActive: Boolean(body.isActive) }),
      updatedBy: userId,
    },
    { new: true, runValidators: true }
  );
  if (!plan) throw new AppError('Plan not found', 404);
  return plan;
};

export const deactivatePlan = async (id, userId) => {
  const plan = await Plan.findByIdAndUpdate(
    id,
    { isActive: false, updatedBy: userId },
    { new: true }
  );
  if (!plan) throw new AppError('Plan not found', 404);
  return plan;
};
