import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Sidebar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const sidebarItems = [
    { label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { label: 'My Cases', icon: '📋', path: '/cases' },
    { label: 'Documents', icon: '📁', path: '/documents' },
    { label: 'Upload Document', icon: '📤', path: '/upload' },
    { label: 'Search', icon: '🔍', path: '#' },
    { label: 'Audit Activity', icon: '📊', path: '/audit' },
    { label: 'Profile', icon: '👤', path: '#' },
  ];

  return (
    <div className="sidebar">
      <div style={{ paddingBottom: '20px', borderBottom: '1px solid #ddd', marginBottom: '20px', marginLeft: '20px', marginRight: '20px' }}>
        <div style={{ fontSize: '12px', fontWeight: '600', color: '#1A1A2E', marginBottom: '5px' }}>LOGGED IN AS</div>
        <div style={{ fontSize: '13px', color: '#8B7355', fontWeight: '600' }}>{user?.role}</div>
        <div style={{ fontSize: '11px', color: '#999', marginTop: '3px' }}>{user?.fullName}</div>
      </div>

      {sidebarItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className="sidebar-item"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <span style={{ fontSize: '16px' }}>{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}

      <div style={{ borderTop: '1px solid #ddd', marginTop: '20px', paddingTop: '15px', marginLeft: '20px', marginRight: '20px' }}>
        <button
          onClick={handleLogout}
          className="button button-danger"
          style={{ width: '100%', textAlign: 'center' }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
