import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function DocumentDetailPage({ user, onLogout }) {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDocument();
  }, [documentId]);

  const fetchDocument = async () => {
    try {
      const response = await axios.get(`/api/documents/${documentId}`);
      setDocument(response.data.document);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch document');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyIntegrity = async () => {
    setVerifying(true);
    setError('');
    try {
      const response = await axios.post(`/api/documents/${documentId}/verify`);
      setVerificationResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <Sidebar user={user} onLogout={onLogout} />
        <div className="content-area">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading document...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !document) {
    return (
      <div className="main-content">
        <Sidebar user={user} onLogout={onLogout} />
        <div className="content-area">
          <div className="container">
            <div className="alert alert-error">{error}</div>
            <button className="button button-secondary" onClick={() => navigate('/documents')}>
              ← Back to Documents
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="content-area">
        <div className="container">
          <button className="button button-secondary" onClick={() => navigate('/documents')} style={{ marginBottom: '20px' }}>
            ← Back to Documents
          </button>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="card">
            <div className="card-header">
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1A1A2E', margin: '0' }}>{document?.documentName}</h1>
              <p style={{ color: '#666', fontSize: '13px', margin: '5px 0 0 0' }}>Document ID: {document?.documentId}</p>
            </div>

            <div className="grid-2" style={{ marginBottom: '30px' }}>
              <div>
                <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A2E', marginBottom: '15px' }}>Document Information</h3>
                <div style={{ fontSize: '13px', lineHeight: '1.8', color: '#333' }}>
                  <div><strong>Case ID:</strong> {document?.caseId}</div>
                  <div><strong>Document Type:</strong> {document?.documentType}</div>
                  <div><strong>Classification:</strong> {document?.classificationLevel}</div>
                  <div><strong>Uploaded By:</strong> {document?.uploadedBy}</div>
                  <div><strong>Upload Date:</strong> {new Date(document?.uploadedAt).toLocaleString()}</div>
                  <div><strong>Version:</strong> {document?.version}</div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A2E', marginBottom: '15px' }}>Description</h3>
                <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>
                  {document?.description || 'No description provided'}
                </p>
              </div>
            </div>

            <div className="security-panel">
              <h3 style={{ color: '#0D47A1', margin: '0 0 15px 0', fontSize: '14px', fontWeight: '600' }}>🔐 Document Security Status</h3>

              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E', marginBottom: '5px' }}>SHA-256 Hash (Original):</div>
                <div className="hash-display" style={{ wordBreak: 'break-all' }}>
                  {document?.sha256Hash}
                </div>
              </div>

              {verificationResult && (
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E', marginBottom: '5px' }}>SHA-256 Hash (Current):</div>
                  <div className="hash-display" style={{ wordBreak: 'break-all' }}>
                    {verificationResult.currentHash}
                  </div>
                </div>
              )}

              {verificationResult && (
                <div style={{ padding: '15px', backgroundColor: verificationResult.verified ? '#E8F5E9' : '#FFEBEE', borderRadius: '4px', marginBottom: '15px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: verificationResult.verified ? '#2E7D32' : '#C62828', marginBottom: '8px' }}>
                    {verificationResult.verified ? '✓ DOCUMENT VERIFIED' : '⚠ HASH MISMATCH DETECTED'}
                  </div>
                  <div style={{ fontSize: '12px', color: verificationResult.verified ? '#1B5E20' : '#B71C1C' }}>
                    {verificationResult.message}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>
                    Verification Status: <strong>{verificationResult.status}</strong>
                  </div>
                </div>
              )}

              <button
                className="button button-primary"
                onClick={handleVerifyIntegrity}
                disabled={verifying}
                style={{ width: '100%' }}
              >
                {verifying ? 'Verifying Document Integrity...' : '🔍 Verify Document Integrity'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentDetailPage;
