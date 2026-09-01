import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function CasesPage({ user, onLogout }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await axios.get('/api/cases');
      setCases(response.data.cases || []);
    } catch (err) {
      setError('Failed to fetch cases');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="content-area">
        <div className="container">
          <div className="card">
            <div className="card-header">
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1A1A2E', margin: '0' }}>My Cases</h1>
            </div>

            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Loading cases...</p>
              </div>
            ) : error ? (
              <div className="alert alert-error">{error}</div>
            ) : cases.length === 0 ? (
              <div className="alert alert-info">No cases found. Check back later.</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Case ID</th>
                    <th>Case Title</th>
                    <th>Status</th>
                    <th>Documents</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((caseItem) => (
                    <tr key={caseItem.id}>
                      <td><strong>{caseItem.case_id}</strong></td>
                      <td>{caseItem.case_title}</td>
                      <td><span className="status-verified">{caseItem.case_status}</span></td>
                      <td>{caseItem.document_count || 0}</td>
                      <td>{new Date(caseItem.created_at).toLocaleDateString()}</td>
                      <td>
                        <button className="action-button action-button-secondary">
                          View Details
                        </button>
                      </td>
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

export default CasesPage;
