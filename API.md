# NAYAYVAULT API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "userId": "INV-001",
  "fullName": "John Investigator",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "Investigator",
  "department": "CID"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "user_id": "INV-001",
    "full_name": "John Investigator",
    "email": "john@example.com",
    "role": "Investigator"
  }
}
```

---

### Login

**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "userId": "INV-001",
  "password": "securePassword123",
  "role": "Investigator"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "userId": "INV-001",
    "fullName": "John Investigator",
    "email": "john@example.com",
    "role": "Investigator",
    "department": "CID"
  }
}
```

---

### Get Current User

**GET** `/auth/me`

Retrieve current authenticated user information.

**Headers:** Authorization Bearer token required

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "userId": "INV-001",
    "fullName": "John Investigator",
    "email": "john@example.com",
    "role": "Investigator",
    "department": "CID"
  }
}
```

---

## Cases Endpoints

### Get All Cases

**GET** `/cases`

Retrieve all authorized cases for current user.

**Headers:** Authorization Bearer token required

**Query Parameters:**
- None

**Response (200):**
```json
{
  "cases": [
    {
      "id": 1,
      "case_id": "CASE-2026-001",
      "case_title": "Investigation Case Alpha",
      "case_status": "Under Investigation",
      "assigned_investigator_name": "John Investigator",
      "document_count": 3,
      "created_at": "2026-09-01T10:00:00Z"
    }
  ],
  "count": 1
}
```

---

### Get Case Details

**GET** `/cases/:caseId`

Retrieve details for a specific case.

**Parameters:**
- `caseId` (string) - The case ID (e.g., CASE-2026-001)

**Response (200):**
```json
{
  "case": {
    "id": 1,
    "case_id": "CASE-2026-001",
    "case_title": "Investigation Case Alpha",
    "case_status": "Under Investigation",
    "description": "Sample case",
    "assigned_investigator_name": "John Investigator",
    "created_at": "2026-09-01T10:00:00Z"
  }
}
```

---

### Create Case

**POST** `/cases`

Create a new case (Investigator and Judge only).

**Headers:** Authorization Bearer token required

**Request Body:**
```json
{
  "caseId": "CASE-2026-002",
  "caseTitle": "New Investigation Case",
  "description": "Case description here"
}
```

**Response (201):**
```json
{
  "message": "Case created successfully",
  "case": {
    "id": 2,
    "case_id": "CASE-2026-002",
    "case_title": "New Investigation Case",
    "case_status": "Under Investigation",
    "description": "Case description here",
    "assigned_investigator_id": 1,
    "created_at": "2026-09-01T11:00:00Z"
  }
}
```

---

## Documents Endpoints

### Upload Document (✅ Generates SHA-256 Hash)

**POST** `/documents/upload`

Upload a document with automatic SHA-256 hash generation.

**Headers:** 
- Authorization Bearer token required
- Content-Type: multipart/form-data

**Form Data:**
- `file` (file, required) - Document file to upload
- `caseId` (string, required) - Case ID (e.g., CASE-2026-001)
- `documentName` (string, required) - Name of document
- `documentType` (string, required) - Type: FIR, Police Report, Investigation Record, etc.
- `description` (string, optional) - Additional description
- `classificationLevel` (string, required) - Public, Restricted, Confidential, Highly Confidential

**Response (201):**
```json
{
  "message": "Document uploaded successfully",
  "document": {
    "id": 5,
    "documentId": "DOC-1725189600000-ABC123XYZ",
    "documentName": "FIR Report",
    "caseId": "CASE-2026-001",
    "sha256Hash": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
    "uploadedAt": "2026-09-01T12:00:00Z",
    "securityStatus": "✓ SHA-256 HASH GENERATED",
    "integrityRecord": "✓ DOCUMENT INTEGRITY RECORD CREATED",
    "auditLog": "✓ AUDIT LOG ENTRY CREATED"
  }
}
```

---

### Get Documents

**GET** `/documents`

Retrieve documents accessible to current user.

**Headers:** Authorization Bearer token required

**Query Parameters:**
- `caseId` (string, optional) - Filter by case ID

**Response (200):**
```json
{
  "documents": [
    {
      "id": 5,
      "document_id": "DOC-1725189600000-ABC123XYZ",
      "document_name": "FIR Report",
      "document_type": "FIR",
      "case_id": 1,
      "classification_level": "Restricted",
      "sha256_hash": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
      "version_number": 1,
      "uploaded_by_name": "John Investigator",
      "uploaded_at": "2026-09-01T12:00:00Z",
      "is_verified": false
    }
  ],
  "count": 1
}
```

---

### Get Document Details

**GET** `/documents/:documentId`

Retrieve detailed information about a specific document.

**Parameters:**
- `documentId` (string) - The document ID (e.g., DOC-1725189600000-ABC123XYZ)

**Response (200):**
```json
{
  "document": {
    "id": 5,
    "documentId": "DOC-1725189600000-ABC123XYZ",
    "documentName": "FIR Report",
    "caseId": "CASE-2026-001",
    "documentType": "FIR",
    "description": "First Information Report",
    "classificationLevel": "Restricted",
    "sha256Hash": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
    "uploadedBy": "John Investigator",
    "uploadedAt": "2026-09-01T12:00:00Z",
    "version": 1,
    "isVerified": false,
    "lastVerifiedAt": null
  }
}
```

---

### Verify Document Integrity (✅ Core SHA-256 Verification)

**POST** `/documents/:documentId/verify`

Verify document integrity by comparing stored and current SHA-256 hashes.

**Parameters:**
- `documentId` (string) - The document ID

**Headers:** Authorization Bearer token required

**Response (200) - Verified:**
```json
{
  "verified": true,
  "originalHash": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
  "currentHash": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
  "status": "SECURE AND VERIFIED",
  "message": "✓ DOCUMENT VERIFIED - The current document matches its original cryptographic integrity record.",
  "verifiedAt": "2026-09-01T13:00:00Z"
}
```

**Response (200) - Hash Mismatch:**
```json
{
  "verified": false,
  "originalHash": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
  "currentHash": "different_hash_here_12345678901234567890123456789012345678",
  "status": "HASH MISMATCH DETECTED - TAMPERING SUSPECTED",
  "message": "⚠ DOCUMENT INTEGRITY ALERT - The current document does not match its original cryptographic record. The document may have been modified.",
  "verifiedAt": "2026-09-01T13:00:00Z"
}
```

**Security Note:**
- Backend reads actual file contents from disk
- Recalculates SHA-256 hash using Node.js crypto
- Compares with stored hash in database
- Logs verification event in audit trail
- Creates integrity alert if mismatch detected

---

## Audit Logs Endpoints

### Get Audit Logs

**GET** `/audit-logs`

Retrieve audit log entries (filtered based on user role).

**Headers:** Authorization Bearer token required

**Query Parameters:**
- `documentId` (string, optional) - Filter by document
- `caseId` (string, optional) - Filter by case
- `action` (string, optional) - Filter by action type
- `limit` (number, optional, default: 50) - Number of results
- `offset` (number, optional, default: 0) - Pagination offset

**Response (200):**
```json
{
  "logs": [
    {
      "id": 1,
      "user_id": 1,
      "user_name": "John Investigator",
      "user_role": "Investigator",
      "action": "UPLOAD_DOCUMENT",
      "document_id": 5,
      "case_id": 1,
      "details": "Uploaded document: FIR Report | SHA-256: a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
      "timestamp": "2026-09-01T12:00:00Z",
      "ip_address": "192.168.1.100"
    },
    {
      "id": 2,
      "user_id": 1,
      "user_name": "John Investigator",
      "user_role": "Investigator",
      "action": "VERIFY_DOCUMENT_SUCCESS",
      "document_id": 5,
      "case_id": 1,
      "details": "Document verified successfully",
      "timestamp": "2026-09-01T13:00:00Z",
      "ip_address": "192.168.1.100"
    }
  ],
  "count": 2
}
```

---

### Get Audit Summary

**GET** `/audit-logs/summary`

Get summary of audit log actions (Judge only).

**Headers:** Authorization Bearer token required

**Response (200):**
```json
{
  "summary": [
    {
      "action": "LOGIN",
      "count": 12,
      "last_occurrence": "2026-09-01T14:30:00Z"
    },
    {
      "action": "UPLOAD_DOCUMENT",
      "count": 5,
      "last_occurrence": "2026-09-01T14:25:00Z"
    },
    {
      "action": "VERIFY_DOCUMENT_SUCCESS",
      "count": 3,
      "last_occurrence": "2026-09-01T14:20:00Z"
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied. No access to this case"
}
```

### 404 Not Found
```json
{
  "error": "Document not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|----------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

---

## Rate Limiting

API endpoints have rate limiting:
- Window: 15 minutes
- Max requests: 100 per window
- Applies to authentication endpoints more strictly

---

## Testing with cURL

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "INV-001",
    "password": "password",
    "role": "Investigator"
  }'
```

### Test Document Upload
```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@document.pdf" \
  -F "caseId=CASE-2026-001" \
  -F "documentName=Test Document" \
  -F "documentType=FIR" \
  -F "classificationLevel=Restricted"
```

### Test Document Verification (SHA-256)
```bash
curl -X POST http://localhost:5000/api/documents/DOC-1725189600000-ABC123XYZ/verify \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Audit Log Actions

| Action | Description |
|--------|-------------|
| LOGIN | User login successful |
| LOGOUT | User logout |
| CREATE_CASE | New case created |
| UPLOAD_DOCUMENT | Document uploaded with SHA-256 |
| VERIFY_DOCUMENT_SUCCESS | Document integrity verified successfully |
| VERIFY_DOCUMENT_INTEGRITY_FAILURE | SHA-256 hash mismatch detected |
| VIEW_DOCUMENT | Document accessed |
| UNAUTHORIZED_ACCESS_ATTEMPT | Access denied |

---

## Role-Based Access Matrix

| Endpoint | Investigator | Judge | Forensic | Lawyer |
|----------|-------------|-------|----------|--------|
| POST /auth/login | ✓ | ✓ | ✓ | ✓ |
| GET /cases | ✓ | ✓ | ✗ | ✓ |
| POST /cases | ✓ | ✓ | ✗ | ✗ |
| POST /documents/upload | ✓ | ✓ | ✓ | ✓ |
| GET /documents | ✓ | ✓ | Limited | ✓ |
| POST /documents/:id/verify | ✓ | ✓ | ✓ | ✓ |
| GET /audit-logs | Limited | ✓ | Limited | Limited |
| GET /audit-logs/summary | ✗ | ✓ | ✗ | ✗ |

---

**NAYAYVAULT API Documentation - Secure. Traceable. Trusted.**
