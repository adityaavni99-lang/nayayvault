import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDatabase } from './db/init.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import caseRoutes from './routes/cases.js';
import documentRoutes from './routes/documents.js';
import auditRoutes from './routes/audit.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : '*',
  credentials: true
}));

// Logging
app.use(morgan('combined'));

// Body Parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static Files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/audit-logs', auditRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'NAYAYVAULT Backend Active', timestamp: new Date() });
});

// Error Handler
app.use(errorHandler);

// Initialize Database and Start Server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`\n╔════════════════════════════════════════╗`);
    console.log(`║     NAYAYVAULT Backend Started       ║`);
    console.log(`║     Secure. Traceable. Trusted.      ║`);
    console.log(`║     Port: ${PORT}                          ║`);
    console.log(`╚════════════════════════════════════════╝\n`);
  });
}).catch(error => {
  console.error('Failed to start NAYAYVAULT:', error);
  process.exit(1);
});
