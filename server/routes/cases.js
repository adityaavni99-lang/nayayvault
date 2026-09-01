import express from 'express';
import { query } from '../db/init.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { logAudit } from '../utils/audit.js';

const router = express.Router();

// Get All Cases (with authorization)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let result;

    if (req.user.role === 'Judge') {
      // Judge sees all cases
      result = await query(`
        SELECT c.*, u.full_name as assigned_investigator_name, COUNT(d.id) as document_count
        FROM cases c
        LEFT JOIN users u ON c.assigned_investigator_id = u.id
        LEFT JOIN documents d ON c.id = d.case_id
        GROUP BY c.id, u.full_name
        ORDER BY c.created_at DESC
      `);
    } else {
      // Other roles see only authorized cases
      result = await query(`
        SELECT c.*, u.full_name as assigned_investigator_name, COUNT(d.id) as document_count
        FROM cases c
        LEFT JOIN users u ON c.assigned_investigator_id = u.id
        LEFT JOIN documents d ON c.id = d.case_id
        LEFT JOIN case_permissions cp ON c.id = cp.case_id
        WHERE cp.user_id = $1 OR c.assigned_investigator_id = $1
        GROUP BY c.id, u.full_name
        ORDER BY c.created_at DESC
      `, [req.user.id]);
    }

    res.json({
      cases: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching cases:', error);
    res.status(500).json({ error: 'Failed to fetch cases' });
  }
});

// Get Single Case
router.get('/:caseId', authenticateToken, async (req, res) => {
  try {
    const { caseId } = req.params;

    const result = await query(`
      SELECT c.*, u.full_name as assigned_investigator_name
      FROM cases c
      LEFT JOIN users u ON c.assigned_investigator_id = u.id
      WHERE c.case_id = $1
    `, [caseId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const caseData = result.rows[0];

    if (req.user.role !== 'Judge') {
      const permResult = await query(
        'SELECT * FROM case_permissions WHERE case_id = $1 AND user_id = $2',
        [caseData.id, req.user.id]
      );

      if (permResult.rows.length === 0 && caseData.assigned_investigator_id !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json({ case: caseData });
  } catch (error) {
    console.error('Error fetching case:', error);
    res.status(500).json({ error: 'Failed to fetch case' });
  }
});

// Create Case
router.post('/', authenticateToken, authorizeRole('Judge', 'Investigator'), async (req, res) => {
  try {
    const { caseId, caseTitle, description } = req.body;

    if (!caseId || !caseTitle) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await query(
      'INSERT INTO cases (case_id, case_title, description, assigned_investigator_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [caseId, caseTitle, description, req.user.id]
    );

    await logAudit(req.user.id, req.user.role, 'CREATE_CASE', null, result.rows[0].id, `Created case: ${caseId}`, req.ip);

    res.status(201).json({
      message: 'Case created successfully',
      case: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating case:', error);
    res.status(500).json({ error: 'Failed to create case' });
  }
});

export default router;
