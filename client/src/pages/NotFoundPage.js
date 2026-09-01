import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
      <div className="access-denied-container">
        <div className="access-denied-icon">404</div>
        <div className="access-denied-title">Page Not Found</div>
        <div className="access-denied-message">
          The page you are looking for does not exist or has been moved.
        </div>
        <Link to="/" className="button button-primary" style={{ display: 'inline-block' }}>
          ← Return to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
