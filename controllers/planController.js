import * as planService from '../services/planService.js';

export const list = async (req, res) => {
  if (req.user?.role === 'admin') {
    const result = await planService.listAdminPlans(req.query);
    return res.json(result);
  }
  const plans = await planService.listActivePlans();
  res.json(plans);
};

export const getOne = async (req, res) => {
  const plan = await planService.getPlanById(req.params.id, {
    admin: req.user?.role === 'admin',
  });
  res.json(plan);
};

export const create = async (req, res) => {
  const plan = await planService.createPlan(req.body, req.user._id);
  res.status(201).json(plan);
};

export const update = async (req, res) => {
  const plan = await planService.updatePlan(req.params.id, req.body, req.user._id);
  res.json(plan);
};

export const remove = async (req, res) => {
  const plan = await planService.deactivatePlan(req.params.id, req.user._id);
  res.json({ message: 'Plan deactivated', plan });
};
