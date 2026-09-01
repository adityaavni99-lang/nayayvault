import jwt from 'jsonwebtoken';
import { query } from '../db/init.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await query('SELECT * FROM users WHERE id = $1', [decoded.userId]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied. Required role not found.',
        userRole: req.user.role,
        requiredRoles: allowedRoles
      });
    }
    next();
  };
};

export const authorizeCaseAccess = async (req, res, next) => {
  try {
    const { caseId } = req.params;
    const userId = req.user.id;

    if (req.user.role === 'Judge') {
      return next();
    }

    const result = await query(
      'SELECT * FROM case_permissions WHERE case_id = (SELECT id FROM cases WHERE case_id = $1) AND user_id = $2',
      [caseId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'No access to this case' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Authorization check failed' });
  }
};
