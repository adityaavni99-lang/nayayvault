import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const demoUsers = {
    'Investigator': { id: 'INV-001', pass: 'password' },
    'Judge': { id: 'JUD-001', pass: 'password' },
    'Forensic': { id: 'FOR-001', pass: 'password' },
    'Lawyer': { id: 'LAW-001', pass: 'password' }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    const demo = demoUsers[role];
    setUserId(demo.id);
    setPassword(demo.pass);
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', {
        userId,
        password,
        role: selectedRole
      });

      onLogin(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', paddingTop: '60px', paddingBottom: '60px' }}>
      <div className="login-box">
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#8B7355', marginBottom: '5px' }}>NAYAYVAULT</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Secure. Traceable. Trusted.</div>
        </div>

        <div className="login-title">Login to Your Account</div>

        <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px', textAlign: 'center' }}>Select your role and enter credentials</p>

        <div className="role-selector">
          <button
            className={`role-button ${selectedRole === 'Investigator' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('Investigator')}
          >
            🔍 Investigator Login
          </button>
          <button
            className={`role-button ${selectedRole === 'Judge' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('Judge')}
          >
            ⚖️ Judge Login
          </button>
          <button
            className={`role-button ${selectedRole === 'Forensic' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('Forensic')}
          >
            🧪 Forensic Login
          </button>
          <button
            className={`role-button ${selectedRole === 'Lawyer' ? 'selected' : ''}`}
            onClick={() => handleRoleSelect('Lawyer')}
          >
            📜 Lawyer Login
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Official User ID</label>
            <input
              type="text"
              className="form-input"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            className="button button-primary"
            style={{ width: '100%', marginBottom: '15px' }}
            disabled={!selectedRole || loading}
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>

        <div className="security-notice">
          ⚠️ This system contains confidential legal and investigation-related information. Unauthorized access or misuse is strictly prohibited and may be subject to legal action.
        </div>

        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #ddd', fontSize: '12px', color: '#999', textAlign: 'center' }}>
          <p style={{ marginBottom: '10px' }}>Demo Users (Pre-filled):</p>
          <div style={{ fontSize: '11px', textAlign: 'left', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>
            <div>Investigator: INV-001 / password</div>
            <div>Judge: JUD-001 / password</div>
            <div>Forensic: FOR-001 / password</div>
            <div>Lawyer: LAW-001 / password</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
