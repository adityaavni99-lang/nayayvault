import { query } from '../db/init.js';

export const logAudit = async (userId, userRole, action, documentId, caseId, details, ipAddress) => {
  try {
    await query(
      `INSERT INTO audit_logs (user_id, user_role, action, document_id, case_id, details, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, userRole, action, documentId, caseId, details, ipAddress]
    );
  } catch (error) {
    console.error('Audit logging error:', error);
  }
};
