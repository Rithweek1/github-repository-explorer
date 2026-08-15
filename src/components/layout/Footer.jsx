import React from 'react';

export function Footer() {
  return (
    <footer className="app-footer">
      <p>
        <span className="footer-brand">RepoExplorer</span>
        {' '}—{' '}
        Built with React &amp; Vite. Data from the{' '}
        <a
          href="https://docs.github.com/en/rest"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
          aria-label="GitHub REST API documentation"
        >
          GitHub REST API
        </a>
        .
      </p>
    </footer>
  );
}
