import React from 'react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="page-container not-found-page">
      <div className="state-container empty-state">
        <div className="empty-icon">404</div>
        <h2 className="empty-title">Page Not Found</h2>
        <p className="state-message">The route you are trying to access does not exist.</p>
        <Link to="/" className="btn primary-btn" style={{ marginTop: '1rem' }}>
          Return Home
        </Link>
      </div>
    </div>
  );
}
