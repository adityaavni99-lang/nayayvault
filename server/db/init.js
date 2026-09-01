import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export const query = (text, params) => pool.query(text, params);
export const getClient = () => pool.connect();

export const initializeDatabase = async () => {
  try {
    // Create Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(50) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        department VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Cases Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cases (
        id SERIAL PRIMARY KEY,
        case_id VARCHAR(50) UNIQUE NOT NULL,
        case_title VARCHAR(500) NOT NULL,
        case_status VARCHAR(50) DEFAULT 'Under Investigation',
        assigned_investigator_id INTEGER REFERENCES users(id),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Case Permissions Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS case_permissions (
        id SERIAL PRIMARY KEY,
        case_id INTEGER REFERENCES cases(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        permission_level VARCHAR(50),
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(case_id, user_id)
      )
    `);

    // Create Documents Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        document_id VARCHAR(100) UNIQUE NOT NULL,
        case_id INTEGER REFERENCES cases(id) ON DELETE CASCADE,
        document_name VARCHAR(500) NOT NULL,
        document_type VARCHAR(100),
        description TEXT,
        classification_level VARCHAR(50),
        file_path VARCHAR(500),
        file_size BIGINT,
        sha256_hash VARCHAR(64) NOT NULL,
        version_number INTEGER DEFAULT 1,
        previous_version_hash VARCHAR(64),
        uploaded_by INTEGER REFERENCES users(id),
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_verified BOOLEAN DEFAULT false,
        last_verified_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Document Versions Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS document_versions (
        id SERIAL PRIMARY KEY,
        document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
        version_number INTEGER,
        sha256_hash VARCHAR(64) NOT NULL,
        previous_version_hash VARCHAR(64),
        file_path VARCHAR(500),
        uploaded_by INTEGER REFERENCES users(id),
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        change_description TEXT,
        UNIQUE(document_id, version_number)
      )
    `);

    // Create Audit Logs Table (Append-only)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        user_role VARCHAR(50),
        action VARCHAR(100),
        document_id INTEGER REFERENCES documents(id),
        case_id INTEGER REFERENCES cases(id),
        details TEXT,
        ip_address VARCHAR(45),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Integrity Alerts Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS integrity_alerts (
        id SERIAL PRIMARY KEY,
        document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
        alert_type VARCHAR(100),
        original_hash VARCHAR(64),
        current_hash VARCHAR(64),
        detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        details TEXT
      )
    `);

    // Create Indexes for Performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_documents_case_id ON documents(case_id);
      CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON documents(uploaded_by);
      CREATE INDEX IF NOT EXISTS idx_case_permissions_user_id ON case_permissions(user_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_document_id ON audit_logs(document_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
    `);

    console.log('✓ Database initialized successfully');
  } catch (error) {
    console.error('✗ Database initialization error:', error);
    throw error;
  }
};
