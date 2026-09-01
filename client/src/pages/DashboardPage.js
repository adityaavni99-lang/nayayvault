import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function DashboardPage({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="main-content">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="content-area">
        <div className="container">
          <div className="card">
            <div className="card-header">
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1A1A2E', margin: '0' }}>Dashboard</h1>
              <p style={{ color: '#666', fontSize: '14px', margin: '5px 0 0 0' }}>Welcome back, {user.fullName}</p>
            </div>

            <div className="grid-3" style={{ marginBottom: '30px' }}>
              <div style={{ backgroundColor: '#E3F2FD', padding: '20px', borderRadius: '4px', borderLeft: '4px solid #1976D2' }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#1976D2' }}>📁</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>My Cases</div>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#1A1A2E', marginTop: '5px' }}>--</div>
              </div>

              <div style={{ backgroundColor: '#E8F5E9', padding: '20px', borderRadius: '4px', borderLeft: '4px solid #4CAF50' }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#4CAF50' }}>📄</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>Documents</div>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#1A1A2E', marginTop: '5px' }}>--</div>
              </div>

              <div style={{ backgroundColor: '#FFF3E0', padding: '20px', borderRadius: '4px', borderLeft: '4px solid #F57C00' }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#F57C00' }}>🔐</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>Verifications</div>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#1A1A2E', marginTop: '5px' }}>--</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              <Link to="/cases" className="button button-primary" style={{ textDecoration: 'none', textAlign: 'center', padding: '15px' }}>
                📋 View My Cases
              </Link>
              <Link to="/upload" className="button button-primary" style={{ textDecoration: 'none', textAlign: 'center', padding: '15px' }}>
                📤 Upload Document
              </Link>
              <Link to="/documents" className="button button-secondary" style={{ textDecoration: 'none', textAlign: 'center', padding: '15px' }}>
                📁 Manage Documents
              </Link>
              <Link to="/audit" className="button button-secondary" style={{ textDecoration: 'none', textAlign: 'center', padding: '15px' }}>
                📊 View Audit Log
              </Link>
            </div>

            <div style={{ backgroundColor: '#E3F2FD', padding: '20px', borderRadius: '4px', borderLeft: '4px solid #1976D2' }}>
              <h3 style={{ color: '#0D47A1', margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }}>ℹ️ User Information</h3>
              <div style={{ fontSize: '13px', color: '#1A1A2E', lineHeight: '1.8' }}>
                <div><strong>Role:</strong> {user.role}</div>
                <div><strong>User ID:</strong> {user.userId}</div>
                <div><strong>Email:</strong> {user.email}</div>
                {user.department && <div><strong>Department:</strong> {user.department}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
