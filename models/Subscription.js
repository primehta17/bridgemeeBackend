import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired'],
      default: 'active',
    },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date, required: true },
    cancelledAt: { type: Date },
  },
  { timestamps: true }
);

subscriptionSchema.index({ user: 1, status: 1 });

export default mongoose.model('Subscription', subscriptionSchema);
