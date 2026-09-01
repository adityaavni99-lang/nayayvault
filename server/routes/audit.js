import express from 'express';
import { query } from '../db/init.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Get Audit Logs
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { documentId, caseId, action, limit = 50, offset = 0 } = req.query;

    let sqlQuery = `
      SELECT al.*, u.full_name as user_name, d.document_name, c.case_id
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      LEFT JOIN documents d ON al.document_id = d.id
      LEFT JOIN cases c ON al.case_id = c.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (documentId) {
      sqlQuery += ` AND al.document_id = (SELECT id FROM documents WHERE document_id = $${paramIndex})`;
      params.push(documentId);
      paramIndex++;
    }

    if (caseId) {
      sqlQuery += ` AND al.case_id = (SELECT id FROM cases WHERE case_id = $${paramIndex})`;
      params.push(caseId);
      paramIndex++;
    }

    if (action) {
      sqlQuery += ` AND al.action = $${paramIndex}`;
      params.push(action);
      paramIndex++;
    }

    // Authorization: Judge sees all, others see own records only
    if (req.user.role !== 'Judge') {
      sqlQuery += ` AND al.user_id = $${paramIndex}`;
      params.push(req.user.id);
      paramIndex++;
    }

    sqlQuery += ` ORDER BY al.timestamp DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await query(sqlQuery, params);

    res.json({
      logs: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// Get Audit Log Summary
router.get('/summary', authenticateToken, authorizeRole('Judge'), async (req, res) => {
  try {
    const result = await query(`
      SELECT
        action,
        COUNT(*) as count,
        MAX(timestamp) as last_occurrence
      FROM audit_logs
      GROUP BY action
      ORDER BY count DESC
    `);

    res.json({
      summary: result.rows
    });
  } catch (error) {
    console.error('Error fetching audit summary:', error);
    res.status(500).json({ error: 'Failed to fetch audit summary' });
  }
});

export default router;
