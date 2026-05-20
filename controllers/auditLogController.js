import * as auditLogService from '../services/auditLogService.js';

export const list = async (req, res) => {
  const result = await auditLogService.listAuditLogs(req.query);
  res.json(result);
};
