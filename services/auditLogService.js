import AuditLog from '../models/AuditLog.js';
import { parsePagination, paginatedResponse } from '../utils/pagination.js';

export const listAuditLogs = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};

  if (query.entityType) filter.entityType = query.entityType;
  if (query.action) filter.action = query.action;

  const q = query.q?.trim();
  if (q) {
    filter.$or = [
      { summary: { $regex: q, $options: 'i' } },
      { performedByName: { $regex: q, $options: 'i' } },
      { performedByEmail: { $regex: q, $options: 'i' } },
    ];
  }

  const [items, total] = await Promise.all([
    AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    AuditLog.countDocuments(filter),
  ]);

  return paginatedResponse(items, total, page, limit);
};
