import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DocumentsPage from './pages/DocumentsPage';
import CasesPage from './pages/CasesPage';
import UploadPage from './pages/UploadPage';
import DocumentDetailPage from './pages/DocumentDetailPage';
import AuditPage from './pages/AuditPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setToken(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (loginToken, userData) => {
    setToken(loginToken);
    setUser(userData);
    localStorage.setItem('token', loginToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${loginToken}`;
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>NAYAYVAULT Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/dashboard" element={user ? <DashboardPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/cases" element={user ? <CasesPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/documents" element={user ? <DocumentsPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/documents/:documentId" element={user ? <DocumentDetailPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/upload" element={user ? <UploadPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/audit" element={user ? <AuditPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
