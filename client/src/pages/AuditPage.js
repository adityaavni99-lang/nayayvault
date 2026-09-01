import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function AuditPage({ user, onLogout }) {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAuditLogs();
  }, [filter]);

  const fetchAuditLogs = async () => {
    try {
      const response = await axios.get(`/api/audit-logs?limit=100`);
      setAuditLogs(response.data.logs || []);
    } catch (err) {
      setError('Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    if (action.includes('UPLOAD')) return '#4CAF50';
    if (action.includes('VERIFY')) return '#1976D2';
    if (action.includes('FAILURE') || action.includes('MISMATCH')) return '#d32f2f';
    return '#666';
  };

  return (
    <div className="main-content">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="content-area">
        <div className="container">
          <div className="card">
            <div className="card-header">
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1A1A2E', margin: '0' }}>Audit Activity Log</h1>
              <p style={{ color: '#666', fontSize: '13px', margin: '5px 0 0 0' }}>Complete record of all system activities</p>
            </div>

            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Loading audit logs...</p>
              </div>
            ) : error ? (
              <div className="alert alert-error">{error}</div>
            ) : auditLogs.length === 0 ? (
              <div className="alert alert-info">No audit logs found.</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>User</th>
                    <th>Role</th>
                    <th>Action</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ fontSize: '12px' }}>{new Date(log.timestamp).toLocaleString()}</td>
                      <td style={{ fontSize: '12px' }}>{log.user_name || 'System'}</td>
                      <td style={{ fontSize: '12px', fontWeight: '600', color: '#8B7355' }}>{log.user_role}</td>
                      <td style={{ fontSize: '12px', color: getActionColor(log.action), fontWeight: '600' }}>{log.action}</td>
                      <td style={{ fontSize: '12px', color: '#666' }}>{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuditPage;
