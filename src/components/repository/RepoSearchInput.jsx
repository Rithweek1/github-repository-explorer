import React from 'react';

/**
 * Search Bar Component with accessible label, clear button, and quick suggestion chips.
 */
export function RepoSearchInput({ value, onChange, onSubmit, loading }) {
  const popularTags = ['react', 'vite', 'typescript', 'python', 'rust', 'next.js'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(value);
  };

  return (
    <div className="search-input-wrapper">
      <form onSubmit={handleSubmit} className="search-form" role="search">
        <div className="input-group">
          <svg
            className="search-icon"
            viewBox="0 0 16 16"
            width="18"
            height="18"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M10.68 11.74a6 6 0 111.06-1.06l3.04 3.04a.75.75 0 11-1.06 1.06l-3.04-3.04zM11.5 7a4.5 4.5 0 10-9 0 4.5 4.5 0 009 0z" />
          </svg>
          <input
            id="repo-search-input"
            type="text"
            className="search-input"
            placeholder="Search repositories by name or topic…"
            aria-label="Search GitHub repositories"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {value && (
            <button
              type="button"
              className="clear-btn"
              onClick={() => onChange('')}
              aria-label="Clear search"
            >
              <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
                <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
              </svg>
            </button>
          )}
          <button
            type="submit"
            className="btn primary-btn search-btn"
            disabled={loading}
            aria-label="Submit search"
          >
            {loading ? (
              <span className="search-btn-loading" aria-live="polite">
                <span className="btn-spinner" aria-hidden="true" />
                Searching…
              </span>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </form>

      <div className="quick-tags" role="group" aria-label="Popular search topics">
        <span className="tags-label" id="tags-hint">Try:</span>
        {popularTags.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`tag-chip ${value.toLowerCase() === tag ? 'active' : ''}`}
            onClick={() => onSubmit(tag)}
            aria-label={`Search for ${tag}`}
            aria-pressed={value.toLowerCase() === tag}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
