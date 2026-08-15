import React from 'react';

export function ErrorMessage({ title = 'Error Occurred', message, onRetry }) {
  return (
    <div className="state-container error-state" role="alert">
      <div className="error-icon" aria-hidden="true">⚠️</div>
      <h3 className="error-title">{title}</h3>
      <p className="state-message">{message || 'Something went wrong while fetching repository data.'}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn primary-btn" style={{ marginTop: '1.25rem' }}>
          Try Again
        </button>
      )}
    </div>
  );
}
