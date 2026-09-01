import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db/init.js';
import { authenticateToken } from '../middleware/auth.js';
import { logAudit } from '../utils/audit.js';

const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { userId, fullName, email, password, role, department } = req.body;

    if (!userId || !fullName || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const validRoles = ['Investigator', 'Judge', 'Forensic', 'Lawyer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Check if user exists
    const existingUser = await query('SELECT * FROM users WHERE user_id = $1 OR email = $2', [userId, email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await query(
      'INSERT INTO users (user_id, full_name, email, password_hash, role, department) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, user_id, full_name, email, role',
      [userId, fullName, email, passwordHash, role, department]
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { userId, password, role } = req.body;

    if (!userId || !password) {
      return res.status(400).json({ error: 'User ID and password required' });
    }

    const result = await query('SELECT * FROM users WHERE user_id = $1', [userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (role && user.role !== role) {
      return res.status(401).json({ error: 'Role mismatch' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, userRole: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    await logAudit(user.id, user.role, 'LOGIN', null, null, 'User login successful', req.ip);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        userId: user.user_id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get Current User
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      userId: req.user.user_id,
      fullName: req.user.full_name,
      email: req.user.email,
      role: req.user.role,
      department: req.user.department
    }
  });
});

export default router;
