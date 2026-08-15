import React from 'react';
import { formatNumber } from '../../utils/formatters';

/**
 * Component to display an ordered, paginated list of repository contributors.
 */
export function ContributorsList({
  contributors = [],
  loading,
  error,
  currentPage = 1,
  onPageChange,
}) {
  if (loading) {
    return (
      <section className="analytics-section" aria-label="Contributors">
        <h3 className="section-title">Top Contributors</h3>
        <div className="state-placeholder" role="status" aria-live="polite">
          <span className="inline-spinner" aria-hidden="true" /> Loading contributors…
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="analytics-section" aria-label="Contributors">
        <h3 className="section-title">Top Contributors</h3>
        <p className="analytics-error" role="alert">
          ⚠️ Could not load contributors: {error}
        </p>
      </section>
    );
  }

  if (!contributors || contributors.length === 0) {
    return (
      <section className="analytics-section" aria-label="Contributors">
        <h3 className="section-title">Top Contributors</h3>
        <p className="analytics-empty">
          👥 No contributor data available for this repository.
        </p>
      </section>
    );
  }

  const sortedContributors = [...contributors].sort((a, b) => b.contributions - a.contributions);
  const hasNextPage = contributors.length >= 10;

  return (
    <section className="analytics-section" aria-label="Contributors">
      <div className="section-header">
        <h3 className="section-title">Top Contributors</h3>
        <span className="section-subtitle">
          {`${(currentPage - 1) * 10 + 1}–${(currentPage - 1) * 10 + sortedContributors.length}`}
        </span>
      </div>

      <ol className="contributors-grid" aria-label="Contributors ordered by contribution count">
        {sortedContributors.map((contributor, index) => {
          const rank = (currentPage - 1) * 10 + index + 1;
          return (
            <li key={contributor.id || contributor.login} className="contributor-card">
              <span className="rank-badge" aria-label={`Rank ${rank}`}>#{rank}</span>
              <img
                src={contributor.avatar_url}
                alt={`${contributor.login}'s GitHub avatar`}
                className="contributor-avatar"
                loading="lazy"
                width="44"
                height="44"
              />
              <div className="contributor-details">
                <a
                  href={contributor.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contributor-login"
                  aria-label={`View ${contributor.login}'s GitHub profile`}
                >
                  {contributor.login}
                </a>
                <span className="contribution-count">
                  {formatNumber(contributor.contributions)} contribution{contributor.contributions !== 1 ? 's' : ''}
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      {(currentPage > 1 || hasNextPage) && (
        <nav className="pagination-wrapper" aria-label="Contributors pagination">
          <button
            type="button"
            className="btn secondary-btn pagination-btn"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page of contributors"
          >
            ← Previous
          </button>
          <span className="page-indicator" aria-current="page">Page {currentPage}</span>
          <button
            type="button"
            className="btn secondary-btn pagination-btn"
            disabled={!hasNextPage}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page of contributors"
          >
            Next →
          </button>
        </nav>
      )}
    </section>
  );
}
