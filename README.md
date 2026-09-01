# NAYAYVAULT

**Secure Digital Document Management System for Legal, Investigation, Court, and Forensic Documents**

## Tagline

**Secure. Traceable. Trusted.**

## Features

✓ Role-Based Access Control (RBAC)  
✓ SHA-256 Document Integrity Verification  
✓ Tamper Detection  
✓ Complete Auditability  
✓ Version Control  
✓ Secure Document Upload  
✓ Permission-Aware Search  
✓ Append-Only Audit Logging  

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

### Backend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database and server configuration
   ```

3. Start the backend:
   ```bash
   npm run server
   ```

### Frontend Setup

1. Navigate to client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Cases
- `GET /api/cases` - Get all authorized cases
- `GET /api/cases/:caseId` - Get case details
- `POST /api/cases` - Create new case

### Documents
- `POST /api/documents/upload` - Upload document (generates SHA-256)
- `GET /api/documents` - Get documents
- `GET /api/documents/:documentId` - Get document details
- `POST /api/documents/:documentId/verify` - Verify document integrity

### Audit Logs
- `GET /api/audit-logs` - Get audit logs
- `GET /api/audit-logs/summary` - Get audit summary (Judge only)

## User Roles

1. **Investigator** - Upload and search authorized case documents
2. **Judge** - Access all documents and audit trails
3. **Forensic Officer** - Upload forensic reports and evidence
4. **Lawyer** - Upload and access authorized legal documents

## Security Features

### SHA-256 Document Integrity
Every document uploaded receives a unique SHA-256 cryptographic hash calculated by the Node.js backend using `crypto.createHash()`. This ensures:
- Document authenticity
- Tamper detection
- Version tracking
- Integrity verification

### Role-Based Access Control
- Backend authorization on every endpoint
- Case-level permissions
- Classification-based access
- Document visibility enforcement

### Audit Trail
- Append-only logging
- User action tracking
- Timestamp recording
- IP logging
- Hash mismatch alerts

## License

MIT
