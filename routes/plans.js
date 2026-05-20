import express from 'express';
import Plan from '../models/Plan.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { isActive: true };
    const plans = await Plan.find(filter).sort({ price: 1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    if (!plan.isActive && req.user.role !== 'admin') {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, description, price, durationMonths, features, isActive } = req.body;
    if (!name?.trim() || !description?.trim() || price == null || !durationMonths) {
      return res.status(400).json({
        message: 'Name, description, price, and durationMonths are required',
      });
    }

    const plan = await Plan.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      durationMonths: Number(durationMonths),
      features: Array.isArray(features) ? features.filter(Boolean) : [],
      isActive: isActive !== false,
    });
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      {
        ...(req.body.name != null && { name: req.body.name.trim() }),
        ...(req.body.description != null && { description: req.body.description.trim() }),
        ...(req.body.price != null && { price: Number(req.body.price) }),
        ...(req.body.durationMonths != null && {
          durationMonths: Number(req.body.durationMonths),
        }),
        ...(req.body.features != null && {
          features: Array.isArray(req.body.features) ? req.body.features.filter(Boolean) : [],
        }),
        ...(req.body.isActive != null && { isActive: Boolean(req.body.isActive) }),
      },
      { new: true, runValidators: true }
    );
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json({ message: 'Plan deactivated', plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
