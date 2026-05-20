import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired'],
      default: 'active',
    },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date, required: true },
    nextBillingDate: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cancelledAt: { type: Date },
  },
  { timestamps: true }
);

subscriptionSchema.index({ userId: 1, status: 1 });

export default mongoose.model('Subscription', subscriptionSchema);
