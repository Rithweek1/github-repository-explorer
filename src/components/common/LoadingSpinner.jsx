import React from 'react';

export function LoadingSpinner({ message = 'Loading repositories...' }) {
  return (
    <div className="state-container loading-state" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p className="state-message">{message}</p>
    </div>
  );
}
