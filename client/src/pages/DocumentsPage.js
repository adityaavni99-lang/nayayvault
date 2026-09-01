import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function DocumentsPage({ user, onLogout }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('/api/documents');
      setDocuments(response.data.documents || []);
    } catch (err) {
      setError('Failed to fetch documents');
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
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1A1A2E', margin: '0' }}>Document Management</h1>
            </div>

            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Loading documents...</p>
              </div>
            ) : error ? (
              <div className="alert alert-error">{error}</div>
            ) : documents.length === 0 ? (
              <div className="alert alert-info">No documents found. Upload your first document to get started.</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Document Name</th>
                    <th>Type</th>
                    <th>Uploaded By</th>
                    <th>Upload Date</th>
                    <th>Version</th>
                    <th>Integrity Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td><strong>{doc.document_name}</strong></td>
                      <td>{doc.document_type || 'N/A'}</td>
                      <td>{doc.uploaded_by_name || 'Unknown'}</td>
                      <td>{new Date(doc.uploaded_at).toLocaleDateString()}</td>
                      <td>V{doc.version_number}</td>
                      <td>
                        <span className={doc.is_verified ? 'status-verified' : 'status-unverified'}>
                          {doc.is_verified ? '✓ Verified' : '⏳ Unverified'}
                        </span>
                      </td>
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

export default DocumentsPage;
