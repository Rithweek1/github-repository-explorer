import React from 'react';
import { formatBytes } from '../../utils/formatters';

/**
 * Component to visualize repository programming language statistics.
 * Renders a stacked percentage bar and a breakdown card grid.
 */
export function LanguageStats({ languages, loading, error }) {
  if (loading) {
    return (
      <section className="analytics-section" aria-label="Language Distribution">
        <h3 className="section-title">Language Distribution</h3>
        <div className="state-placeholder" role="status" aria-live="polite">
          <span className="inline-spinner" aria-hidden="true" /> Loading language data…
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="analytics-section" aria-label="Language Distribution">
        <h3 className="section-title">Language Distribution</h3>
        <p className="analytics-error" role="alert">
          ⚠️ Could not load language data: {error}
        </p>
      </section>
    );
  }

  if (!languages || languages.length === 0) {
    return (
      <section className="analytics-section" aria-label="Language Distribution">
        <h3 className="section-title">Language Distribution</h3>
        <p className="analytics-empty">
          🔍 No language data is available for this repository.
        </p>
      </section>
    );
  }

  return (
    <section className="analytics-section" aria-label="Language Distribution">
      <div className="section-header">
        <h3 className="section-title">Language Distribution</h3>
        <span className="section-subtitle">{languages.length} language{languages.length !== 1 ? 's' : ''} detected</span>
      </div>

      {/* Multi-colour stacked distribution bar */}
      <div className="language-bar-container" aria-hidden="true" title="Language distribution bar">
        <div className="language-bar">
          {languages.map((lang) => (
            <div
              key={lang.name}
              className="language-bar-segment"
              style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
              title={`${lang.name}: ${lang.percentage}%`}
            />
          ))}
        </div>
        {/* Bar legend below */}
        <div className="language-bar-legend">
          {languages.map((lang) => (
            <span key={lang.name} className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: lang.color }} aria-hidden="true" />
              {lang.name}
            </span>
          ))}
        </div>
      </div>

      {/* Language Breakdown Cards */}
      <div className="language-grid" role="list" aria-label="Language breakdown">
        {languages.map((lang) => (
          <div key={lang.name} className="language-card" role="listitem">
            <div className="language-card-header">
              <span className="color-dot" style={{ backgroundColor: lang.color }} aria-hidden="true" />
              <span className="language-name">{lang.name}</span>
            </div>
            <div className="language-progress-track">
              <div
                className="language-progress-fill"
                style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                aria-label={`${lang.percentage}% of codebase`}
              />
            </div>
            <div className="language-metrics">
              <span className="language-percentage">{lang.percentage}%</span>
              <span className="language-bytes">{formatBytes(lang.bytes)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
