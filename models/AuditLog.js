import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    entityType: { type: String, enum: ['plan', 'subscription'], required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
    action: {
      type: String,
      enum: ['created', 'updated', 'deactivated', 'subscribed', 'cancelled', 'change_plan'],
      required: true,
    },
    summary: { type: String, required: true, trim: true },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    performedByName: { type: String, required: true },
    performedByEmail: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ entityType: 1, createdAt: -1 });

export default mongoose.model('AuditLog', auditLogSchema);
