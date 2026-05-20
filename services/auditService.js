import AuditLog from '../models/AuditLog.js';
import User from '../models/User.js';

const performerMeta = async (userId) => {
  const user = await User.findById(userId).select('name email');
  return {
    performedBy: userId,
    performedByName: user?.name || 'Unknown',
    performedByEmail: user?.email || '',
  };
};

export const recordAudit = async ({
  entityType,
  entityId,
  action,
  summary,
  performedBy,
  metadata = {},
}) => {
  try {
    const performer = await performerMeta(performedBy);
    await AuditLog.create({
      entityType,
      entityId,
      action,
      summary,
      metadata,
      ...performer,
    });
  } catch (err) {
    console.error('Audit log failed:', err.message);
  }
};
