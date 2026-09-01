import React from 'react';

function Header() {
  return (
    <header className="header-main">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="header-left">
          <div className="emblem">
            <div style={{ fontSize: '20px', fontWeight: '700' }}>सत्यमेव जयते</div>
            <div style={{ fontSize: '10px', marginTop: '2px' }}>Truth Alone Triumphs</div>
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1A1A2E', margin: '0' }}>NAYAYVAULT</h1>
            <p style={{ fontSize: '12px', color: '#666', margin: '2px 0 0 0' }}>Secure Digital Document Management System</p>
          </div>
        </div>
        <div className="header-right">
          <a href="#help" className="nav-link">Help</a>
          <a href="#accessibility" className="nav-link">Accessibility</a>
          <a href="#contact" className="nav-link">Contact</a>
          <a href="/login" className="nav-link" style={{ color: '#8B7355', fontWeight: '600' }}>Login</a>
        </div>
      </div>
    </header>
  );
}

export default Header;
