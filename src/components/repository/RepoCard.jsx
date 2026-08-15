import React from 'react';
import { Link } from 'react-router-dom';
import { formatNumber } from '../../utils/formatters';

/** Language color map for consistent dot coloring on cards */
const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
  HTML: '#e34c26',
  CSS: '#563d7c',
  'C++': '#f34b7d',
  C: '#555555',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  PHP: '#4F5D95',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00',
};

/**
 * Single Repository Card Component.
 * Displays owner avatar, name, description, stars, forks and primary language.
 */
export function RepoCard({ repo }) {
  const {
    name,
    owner,
    description,
    stargazers_count,
    language,
    forks_count,
    open_issues_count,
  } = repo;

  const detailPath = `/repo/${owner?.login}/${name}`;
  const langColor = LANG_COLORS[language] || '#8b949e';

  return (
    <article className="repo-card">
      <div className="repo-card-header">
        <div className="repo-owner-info">
          {owner?.avatar_url && (
            <img
              src={owner.avatar_url}
              alt={`${owner.login}'s avatar`}
              className="owner-avatar"
              loading="lazy"
              width="24"
              height="24"
            />
          )}
          <span className="owner-login">{owner?.login}</span>
        </div>
        <Link to={detailPath} className="repo-title-link" aria-label={`View details for ${name}`}>
          <h3 className="repo-title">{name}</h3>
        </Link>
      </div>

      <p className="repo-description">
        {description || <em className="no-description">No description provided.</em>}
      </p>

      <div className="repo-card-footer">
        <div className="repo-meta-items">
          {language && (
            <span className="meta-item language-badge" title={`Primary language: ${language}`}>
              <span
                className="language-dot"
                style={{ backgroundColor: langColor }}
                aria-hidden="true"
              />
              {language}
            </span>
          )}
          <span className="meta-item" title={`${stargazers_count?.toLocaleString()} stars`}>
            <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true" style={{ color: '#e3b341' }}>
              <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
            </svg>
            {formatNumber(stargazers_count)}
          </span>
          <span className="meta-item" title={`${forks_count?.toLocaleString()} forks`}>
            <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true" style={{ color: '#94a3b8' }}>
              <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-.878a2.25 2.25 0 111.5 0v.878a2.25 2.25 0 01-2.25 2.25h-1.5v2.128a2.251 2.251 0 11-1.5 0V8.5h-1.5A2.25 2.25 0 013 6.25v-.878a2.25 2.25 0 115 0zM5 3.25a.75.75 0 10-1.5 0 .75.75 0 001.5 0zm6.75.75a.75.75 0 100-1.5.75.75 0 000 1.5zm-3 8.75a.75.75 0 10-1.5 0 .75.75 0 001.5 0z" />
            </svg>
            {formatNumber(forks_count)}
          </span>
          {open_issues_count > 0 && (
            <span className="meta-item issue-count" title={`${open_issues_count?.toLocaleString()} open issues`}>
              <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true" style={{ color: '#4ade80' }}>
                <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                <path fillRule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z" />
              </svg>
              {formatNumber(open_issues_count)}
            </span>
          )}
        </div>

        <Link to={detailPath} className="btn secondary-btn view-details-btn">
          View →
        </Link>
      </div>
    </article>
  );
}
