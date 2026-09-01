# NAYAYVAULT Database Setup Guide

## Prerequisites

- PostgreSQL 12 or higher installed
- PostgreSQL running and accessible
- `psql` command-line tool available

## Setup Steps

### 1. Create Database User

```bash
sudo -u postgres psql
```

Inside psql:

```sql
CREATE USER nayayvault_user WITH PASSWORD 'secure_password';
ALTER USER nayayvault_user CREATEDB;
```

### 2. Create Database

```sql
CREATE DATABASE nayayvault OWNER nayayvault_user;
```

### 3. Grant Permissions

```sql
GRANT ALL PRIVILEGES ON DATABASE nayayvault TO nayayvault_user;
```

### 4. Connect to Database

```sql
\c nayayvault nayayvault_user
```

### 5. Tables are Created Automatically

When you start the backend server with `npm run server`, the database tables will be automatically created via the `initializeDatabase()` function in `server/db/init.js`.

The initialization creates:
- users
- cases
- case_permissions
- documents (with SHA-256 hashes)
- document_versions
- audit_logs (append-only)
- integrity_alerts
- Indexes for performance

### 6. Create Demo Users

After starting the backend, register demo users via the API:

```bash
# Investigator
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "INV-001",
    "fullName": "Investigator One",
    "email": "investigator@example.com",
    "password": "password",
    "role": "Investigator",
    "department": "CID"
  }'

# Judge
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "JUD-001",
    "fullName": "Judge One",
    "email": "judge@example.com",
    "password": "password",
    "role": "Judge",
    "department": "Judiciary"
  }'

# Forensic Officer
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "FOR-001",
    "fullName": "Forensic Officer One",
    "email": "forensic@example.com",
    "password": "password",
    "role": "Forensic",
    "department": "Forensics"
  }'

# Lawyer
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "LAW-001",
    "fullName": "Lawyer One",
    "email": "lawyer@example.com",
    "password": "password",
    "role": "Lawyer",
    "department": "Legal"
  }'
```

### 7. Create Demo Cases

```bash
# Login as Investigator first to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userId": "INV-001", "password": "password", "role": "Investigator"}'

# Use the returned token for creating cases
curl -X POST http://localhost:5000/api/cases \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "caseId": "CASE-2026-001",
    "caseTitle": "Investigation Case Alpha",
    "description": "Sample investigation case for demonstration"
  }'
```

## Database Backup

### Backup Database

```bash
pg_dump -U nayayvault_user -h localhost nayayvault > backup.sql
```

### Restore Database

```bash
psql -U nayayvault_user -h localhost nayayvault < backup.sql
```

## Troubleshooting

### Connection Refused

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql
```

### Database Already Exists

```sql
DROP DATABASE nayayvault;
-- Then recreate
```

### Check Database

```bash
psql -U nayayvault_user -d nayayvault

# List tables
\dt

# View audit logs
SELECT * FROM audit_logs LIMIT 10;

# View documents with hashes
SELECT id, document_id, document_name, sha256_hash FROM documents;
```

## Environment Variables

Update `.env` file:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nayayvault
DB_USER=nayayvault_user
DB_PASSWORD=secure_password
```

## Security Considerations

1. **Change default password**: Always change `secure_password` in production
2. **Use strong passwords**: Generate cryptographically secure passwords
3. **Restrict access**: Only allow local connections or specific IPs
4. **Enable SSL**: Configure PostgreSQL to use SSL connections
5. **Regular backups**: Implement automated backup schedules
6. **Monitor logs**: Check PostgreSQL logs for suspicious activity

## Production Setup

For production environments:

```sql
-- Use more restrictive permissions
ALTER USER nayayvault_user WITH PASSWORD 'very_strong_password_here';
GRANT USAGE ON SCHEMA public TO nayayvault_user;
GRANT CREATE ON SCHEMA public TO nayayvault_user;
```

Enable SSL and require encrypted connections.
