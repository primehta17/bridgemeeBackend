import mongoose from 'mongoose';

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    durationMonths: { type: Number, required: true, min: 1 },
    features: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Plan', planSchema);
