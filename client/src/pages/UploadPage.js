import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function UploadPage({ user, onLogout }) {
  const [formData, setFormData] = useState({
    caseId: '',
    documentName: '',
    documentType: 'FIR',
    description: '',
    classificationLevel: 'Restricted'
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const documentTypes = [
    'FIR',
    'Police Report',
    'Investigation Record',
    'Witness Statement',
    'Charge Sheet',
    'Court Filing',
    'Evidence Record',
    'Forensic Report',
    'Legal Notice',
    'Court Judgment'
  ];

  const classificationLevels = [
    { value: 'Public', label: 'Public - Low sensitivity' },
    { value: 'Restricted', label: 'Restricted - Authorized personnel only' },
    { value: 'Confidential', label: 'Confidential - Limited authorized personnel' },
    { value: 'Highly Confidential', label: 'Highly Confidential - Strictly controlled' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!file) {
        setError('Please select a file to upload');
        setLoading(false);
        return;
      }

      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('caseId', formData.caseId);
      uploadFormData.append('documentName', formData.documentName);
      uploadFormData.append('documentType', formData.documentType);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('classificationLevel', formData.classificationLevel);

      const response = await axios.post('/api/documents/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess(`✓ Document uploaded successfully! SHA-256: ${response.data.document.sha256Hash.substring(0, 16)}...`);
      setFormData({
        caseId: '',
        documentName: '',
        documentType: 'FIR',
        description: '',
        classificationLevel: 'Restricted'
      });
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="content-area">
        <div className="container">
          <div className="card" style={{ maxWidth: '700px' }}>
            <div className="card-header">
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1A1A2E', margin: '0' }}>Upload Document</h1>
              <p style={{ color: '#666', fontSize: '13px', margin: '10px 0 0 0' }}>Securely upload legal and investigation documents</p>
            </div>

            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Case ID *</label>
                <input
                  type="text"
                  name="caseId"
                  className="form-input"
                  placeholder="e.g., CASE-2026-001"
                  value={formData.caseId}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Document Name *</label>
                <input
                  type="text"
                  name="documentName"
                  className="form-input"
                  placeholder="e.g., FIR Report"
                  value={formData.documentName}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Document Type *</label>
                <select
                  name="documentType"
                  className="form-select"
                  value={formData.documentType}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                >
                  {documentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  placeholder="Optional: Additional details about this document"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={loading}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Classification Level *</label>
                <select
                  name="classificationLevel"
                  className="form-select"
                  value={formData.classificationLevel}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                >
                  {classificationLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Upload File *</label>
                <input
                  type="file"
                  className="form-input"
                  onChange={handleFileChange}
                  required
                  disabled={loading}
                  accept=".pdf,.jpg,.jpeg,.png,.txt,.doc,.docx"
                />
                <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                  Max file size: 50MB. Supported: PDF, DOC, DOCX, JPG, PNG, TXT
                </p>
              </div>

              <button
                type="submit"
                className="button button-primary"
                style={{ width: '100%', padding: '12px' }}
                disabled={loading}
              >
                {loading ? 'Uploading... Generating SHA-256...' : '📤 Upload Document'}
              </button>
            </form>

            <div style={{ backgroundColor: '#E3F2FD', padding: '15px', borderRadius: '4px', marginTop: '25px' }}>
              <h3 style={{ color: '#0D47A1', margin: '0 0 10px 0', fontSize: '13px', fontWeight: '600' }}>🔐 Security Information</h3>
              <p style={{ fontSize: '12px', color: '#1A1A2E', margin: '0', lineHeight: '1.6' }}>
                Your document will be securely processed with SHA-256 cryptographic integrity verification. A unique hash will be generated and stored for tamper detection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;
