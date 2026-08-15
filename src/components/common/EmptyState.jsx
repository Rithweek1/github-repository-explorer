import React from 'react';

export function EmptyState({ icon = '🔍', title = 'No results found', message = 'Try searching with a different keyword.' }) {
  return (
    <div className="state-container empty-state" role="status">
      <div className="empty-icon" aria-hidden="true">{icon}</div>
      <h3 className="empty-title">{title}</h3>
      <p className="state-message">{message}</p>
    </div>
  );
}
