import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { query } from '../db/init.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { logAudit } from '../utils/audit.js';
import { verifyDocumentIntegrity } from '../utils/crypto.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 52428800 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Upload Document
router.post('/upload', authenticateToken, authorizeRole('Investigator', 'Judge', 'Forensic', 'Lawyer'), upload.single('file'), async (req, res) => {
  try {
    const { caseId, documentName, documentType, description, classificationLevel } = req.body;
    const file = req.file;

    if (!caseId || !documentName || !file) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify case exists and user has access
    const caseResult = await query('SELECT * FROM cases WHERE case_id = $1', [caseId]);
    if (caseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const caseRecord = caseResult.rows[0];

    if (req.user.role !== 'Judge') {
      const permResult = await query(
        'SELECT * FROM case_permissions WHERE case_id = $1 AND user_id = $2',
        [caseRecord.id, req.user.id]
      );

      if (permResult.rows.length === 0 && caseRecord.assigned_investigator_id !== req.user.id) {
        return res.status(403).json({ error: 'Access denied to this case' });
      }
    }

    // ===== CORE SECURITY: SHA-256 HASH GENERATION =====
    const sha256Hash = crypto
      .createHash('sha256')
      .update(file.buffer)
      .digest('hex');
    // ===== END SHA-256 GENERATION =====

    const documentId = `DOC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const fileName = `${documentId}_${Date.now()}.bin`;
    const filePath = path.join(process.env.UPLOAD_DIR || './uploads', fileName);

    // Ensure upload directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // Save file to disk
    await fs.writeFile(filePath, file.buffer);

    // Store document metadata in database
    const docResult = await query(
      `INSERT INTO documents (
        document_id, case_id, document_name, document_type, description,
        classification_level, file_path, file_size, sha256_hash, uploaded_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        documentId,
        caseRecord.id,
        documentName,
        documentType,
        description,
        classificationLevel || 'Restricted',
        filePath,
        file.size,
        sha256Hash,
        req.user.id
      ]
    );

    // Log to audit trail
    await logAudit(
      req.user.id,
      req.user.role,
      'UPLOAD_DOCUMENT',
      docResult.rows[0].id,
      caseRecord.id,
      `Uploaded document: ${documentName} | SHA-256: ${sha256Hash}`,
      req.ip
    );

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: {
        id: docResult.rows[0].id,
        documentId: docResult.rows[0].document_id,
        documentName: docResult.rows[0].document_name,
        caseId,
        sha256Hash,
        uploadedAt: docResult.rows[0].uploaded_at,
        securityStatus: '✓ SHA-256 HASH GENERATED',
        integrityRecord: '✓ DOCUMENT INTEGRITY RECORD CREATED',
        auditLog: '✓ AUDIT LOG ENTRY CREATED'
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Document upload failed' });
  }
});

// Get Documents for Case
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { caseId } = req.query;

    let sqlQuery = 'SELECT d.*, u.full_name as uploaded_by_name FROM documents d LEFT JOIN users u ON d.uploaded_by = u.id';
    const params = [];

    if (caseId) {
      sqlQuery += ' WHERE d.case_id = (SELECT id FROM cases WHERE case_id = $1)';
      params.push(caseId);
    }

    sqlQuery += ' ORDER BY d.uploaded_at DESC';

    const result = await query(sqlQuery, params);

    // Filter documents based on authorization
    const authorizedDocs = await Promise.all(
      result.rows.map(async (doc) => {
        if (req.user.role === 'Judge') {
          return doc;
        }

        const caseResult = await query('SELECT * FROM cases WHERE id = $1', [doc.case_id]);
        const caseRecord = caseResult.rows[0];

        if (caseRecord.assigned_investigator_id === req.user.id) {
          return doc;
        }

        const permResult = await query(
          'SELECT * FROM case_permissions WHERE case_id = $1 AND user_id = $2',
          [caseRecord.id, req.user.id]
        );

        if (permResult.rows.length > 0) {
          return doc;
        }

        return null;
      })
    );

    const filteredDocs = authorizedDocs.filter(doc => doc !== null);

    res.json({
      documents: filteredDocs,
      count: filteredDocs.length
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Get Document Details
router.get('/:documentId', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT d.*, u.full_name as uploaded_by_name, c.case_id FROM documents d LEFT JOIN users u ON d.uploaded_by = u.id LEFT JOIN cases c ON d.case_id = c.id WHERE d.document_id = $1',
      [req.params.documentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const doc = result.rows[0];

    if (req.user.role !== 'Judge') {
      const caseResult = await query('SELECT * FROM cases WHERE id = $1', [doc.case_id]);
      const caseRecord = caseResult.rows[0];

      if (caseRecord.assigned_investigator_id !== req.user.id) {
        const permResult = await query(
          'SELECT * FROM case_permissions WHERE case_id = $1 AND user_id = $2',
          [caseRecord.id, req.user.id]
        );

        if (permResult.rows.length === 0) {
          return res.status(403).json({ error: 'Access denied' });
        }
      }
    }

    res.json({
      document: {
        id: doc.id,
        documentId: doc.document_id,
        documentName: doc.document_name,
        caseId: doc.case_id,
        documentType: doc.document_type,
        description: doc.description,
        classificationLevel: doc.classification_level,
        sha256Hash: doc.sha256_hash,
        uploadedBy: doc.uploaded_by_name,
        uploadedAt: doc.uploaded_at,
        version: doc.version_number,
        isVerified: doc.is_verified,
        lastVerifiedAt: doc.last_verified_at
      }
    });
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

// ===== CORE SECURITY: VERIFY DOCUMENT INTEGRITY =====
router.post('/:documentId/verify', authenticateToken, async (req, res) => {
  try {
    const result = await query('SELECT * FROM documents WHERE document_id = $1', [req.params.documentId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const doc = result.rows[0];

    // Authorization check
    if (req.user.role !== 'Judge') {
      const caseResult = await query('SELECT * FROM cases WHERE id = $1', [doc.case_id]);
      const caseRecord = caseResult.rows[0];

      if (caseRecord.assigned_investigator_id !== req.user.id) {
        const permResult = await query(
          'SELECT * FROM case_permissions WHERE case_id = $1 AND user_id = $2',
          [caseRecord.id, req.user.id]
        );

        if (permResult.rows.length === 0) {
          return res.status(403).json({ error: 'Access denied' });
        }
      }
    }

    // Read actual file and calculate current SHA-256 hash
    const fileBuffer = await fs.readFile(doc.file_path);
    const currentHash = crypto
      .createHash('sha256')
      .update(fileBuffer)
      .digest('hex');

    // Compare hashes
    const isVerified = currentHash === doc.sha256_hash;

    // Update verification timestamp
    await query(
      'UPDATE documents SET is_verified = $1, last_verified_at = CURRENT_TIMESTAMP WHERE id = $2',
      [isVerified, doc.id]
    );

    // Log verification action
    await logAudit(
      req.user.id,
      req.user.role,
      isVerified ? 'VERIFY_DOCUMENT_SUCCESS' : 'VERIFY_DOCUMENT_INTEGRITY_FAILURE',
      doc.id,
      doc.case_id,
      isVerified ? `Document verified successfully` : `SHA-256 hash mismatch detected`,
      req.ip
    );

    if (!isVerified) {
      // Record integrity alert
      await query(
        'INSERT INTO integrity_alerts (document_id, alert_type, original_hash, current_hash, details) VALUES ($1, $2, $3, $4, $5)',
        [doc.id, 'HASH_MISMATCH', doc.sha256_hash, currentHash, 'Document contents have been modified']
      );
    }

    res.json({
      verified: isVerified,
      originalHash: doc.sha256_hash,
      currentHash: currentHash,
      status: isVerified ? 'SECURE AND VERIFIED' : 'HASH MISMATCH DETECTED - TAMPERING SUSPECTED',
      message: isVerified
        ? '✓ DOCUMENT VERIFIED - The current document matches its original cryptographic integrity record.'
        : '⚠ DOCUMENT INTEGRITY ALERT - The current document does not match its original cryptographic record. The document may have been modified.',
      verifiedAt: new Date()
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Document verification failed' });
  }
});
// ===== END INTEGRITY VERIFICATION =====

export default router;
