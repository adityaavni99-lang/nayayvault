# NAYAYVAULT - Complete Setup Instructions

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js v16+ ([Download](https://nodejs.org/))
- PostgreSQL v12+ ([Download](https://www.postgresql.org/))
- Git

### Option 1: Automated Setup (Linux/Mac)

```bash
cd nayayvault
chmod +x setup.sh
./setup.sh
```

### Option 2: Automated Setup (Windows)

```cmd
cd nayayvault
setup.bat
```

### Option 3: Manual Setup

**Step 1: Install Dependencies**
```bash
# Backend dependencies
npm install

# Frontend dependencies
cd client
npm install
cd ..
```

**Step 2: Configure Environment**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

**Step 3: Start the Application**

```bash
# Option A: Run both together
npm run dev

# Option B: Run separately (open 2 terminals)
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend
cd client
npm start
```

**Step 4: Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

---

## 🔑 Demo Login Credentials

| Role | User ID | Password |
|------|---------|----------|
| Investigator | INV-001 | password |
| Judge | JUD-001 | password |
| Forensic Officer | FOR-001 | password |
| Lawyer | LAW-001 | password |

---

## 📚 Documentation Files

- **README.md** - Project overview and features
- **API.md** - Complete API endpoint documentation
- **DATABASE.md** - Database setup and configuration
- **DEPLOYMENT.md** - Production deployment guide

---

## 🔐 Core Security Features

### SHA-256 Document Integrity Verification

✅ **How it works:**
1. User uploads document
2. Backend calculates SHA-256 hash from file contents
3. Hash is stored in PostgreSQL
4. User can verify document integrity anytime
5. If file is tampered with, hash won't match
6. System alerts on hash mismatch

### Example Workflow:

```bash
# 1. Upload document (generates SHA-256)
POST /api/documents/upload
→ Hash: a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3

# 2. Later: Verify document integrity
POST /api/documents/DOC-123/verify
→ Current Hash: a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3
→ Status: ✓ VERIFIED

# 3. If document was modified:
POST /api/documents/DOC-123/verify
→ Current Hash: different_hash_12345678901234567890123456789012345678
→ Status: ⚠ HASH MISMATCH - TAMPERING DETECTED
```

---

## 🎯 Key Pages & Features

### Home Page
- Public landing page
- Product information
- Login button
- Feature overview

### Login Page
- Role-based login (4 roles)
- Demo credentials pre-filled
- Security notice
- Secure authentication

### Dashboard
- User welcome message
- Quick stats
- Navigation buttons
- User information display

### Case Management
- View all authorized cases
- Case details
- Document count per case
- Case status tracking

### Document Management
- Upload documents with SHA-256 generation
- View all documents
- Document details
- Version tracking
- Integrity verification

### Document Viewer
- Display document information
- Show SHA-256 hash
- Verify document integrity button
- Security panel with verification results

### Audit Trail
- Complete activity log
- Append-only (cannot be deleted)
- User actions tracked
- Timestamps and IP addresses
- Hash mismatch alerts

---

## 🧪 Testing the Application

### Test 1: Upload a Document
1. Login as INV-001 (Investigator)
2. Click "Upload Document"
3. Fill in form:
   - Case ID: CASE-2026-001
   - Document Name: Test Document
   - Document Type: FIR
   - Classification: Restricted
4. Select any file (PDF, DOC, etc.)
5. Click "Upload Document"
6. ✅ Document uploaded with SHA-256 hash generated

### Test 2: Verify Document Integrity
1. Go to "Documents" page
2. Click on uploaded document
3. Click "Verify Document Integrity"
4. Backend recalculates SHA-256
5. ✅ Shows "DOCUMENT VERIFIED" if unchanged
6. Shows "HASH MISMATCH" if file was modified

### Test 3: Check Audit Log
1. Go to "Audit Activity"
2. See all user actions
3. View document upload events
4. See verification results
5. Check timestamp and user details

### Test 4: Role-Based Access
1. Login as different roles
2. See different dashboards
3. Try accessing unauthorized cases
4. System prevents unauthorized access
5. Failed attempts logged in audit trail

---

## 🔧 Troubleshooting

### Backend not starting
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill process
kill -9 <PID>

# Check database connection
psql -U postgres -d nayayvault -c "SELECT 1"
```

### Frontend not loading
```bash
# Clear cache
cd client
rm -rf node_modules
npm install
npm start
```

### Database connection error
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Update .env with correct credentials
# DB_HOST=localhost
# DB_USER=your_user
# DB_PASSWORD=your_password
```

### Port already in use
```bash
# Change port in .env
PORT=5001

# Or change frontend port
PORT=3001 npm start  # in client directory
```

---

## 📊 Project Structure

```
nayayvault/
├── server/                 # Node.js backend
│   ├── index.js           # Express server
│   ├── db/
│   │   └── init.js        # Database setup
│   ├── middleware/        # Auth & error handling
│   ├── routes/            # API endpoints
│   └── utils/             # Crypto & audit utilities
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── pages/         # React pages
│   │   ├── components/    # React components
│   │   └── index.css      # Tailwind styles
│   └── package.json
├── uploads/               # Document storage (created on first upload)
├── .env.example          # Environment template
├── package.json          # Project config
├── setup.sh              # Linux/Mac setup
├── setup.bat             # Windows setup
├── README.md             # Project overview
├── API.md                # API documentation
├── DATABASE.md           # Database setup
└── DEPLOYMENT.md         # Deployment guide
```

---

## 🔒 Security Best Practices

1. **Change Demo Credentials** - Never use defaults in production
2. **Use HTTPS** - Enable TLS/SSL in production
3. **Strong Passwords** - Enforce password complexity
4. **Regular Backups** - Backup database regularly
5. **Monitor Logs** - Check audit logs for suspicious activity
6. **Update Dependencies** - Keep packages current
7. **Rate Limiting** - Protect against abuse
8. **File Validation** - Check file types and sizes
9. **Encryption** - Enable database encryption at rest
10. **Access Control** - Implement principle of least privilege

---

## 🚀 Production Deployment

### Pre-deployment Checklist
- [ ] Change all demo credentials
- [ ] Update environment variables
- [ ] Enable HTTPS/TLS
- [ ] Configure strong JWT secret
- [ ] Set up database backups
- [ ] Enable rate limiting
- [ ] Configure firewall rules
- [ ] Set up monitoring
- [ ] Review security settings
- [ ] Test thoroughly

### Deployment Steps
1. Review DEPLOYMENT.md
2. Follow DATABASE.md for production setup
3. Configure environment variables
4. Build React app: `cd client && npm run build`
5. Deploy to server
6. Run database migrations
7. Set up SSL certificates
8. Configure reverse proxy (nginx/Apache)
9. Set up monitoring and alerts
10. Test all functionality

---

## 📚 Learning Resources

### Core Technologies
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/)

### Security Topics
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [SHA-256 Hashing](https://en.wikipedia.org/wiki/SHA-2)
- [JWT Authentication](https://jwt.io/)
- [Secure Coding](https://cheatsheetseries.owasp.org/)

---

## 💬 Support & Issues

If you encounter issues:

1. Check the documentation files (README.md, API.md, DATABASE.md)
2. Review error messages in console
3. Check backend logs: `npm run server`
4. Verify database connection
5. Ensure all ports are available
6. Test with demo credentials first

---

## 📝 Next Steps

1. ✅ Run setup script
2. ✅ Start backend and frontend
3. ✅ Login with demo credentials
4. ✅ Upload a test document
5. ✅ Verify document integrity
6. ✅ Check audit logs
7. ✅ Test different roles
8. ✅ Review API endpoints
9. ✅ Deploy to production

---

**NAYAYVAULT - Secure. Traceable. Trusted.**

Built with ❤️ for secure document management
