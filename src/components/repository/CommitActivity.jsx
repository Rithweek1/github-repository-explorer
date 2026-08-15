import React from 'react';
import { transformCommitActivity } from '../../utils/dataTransformations';

/**
 * Component to visualize commit activity as a bar chart with trend summary.
 */
export function CommitActivity({ commits, loading, error }) {
  if (loading) {
    return (
      <section className="analytics-section" aria-label="Commit Activity">
        <h3 className="section-title">Commit Activity</h3>
        <div className="state-placeholder" role="status" aria-live="polite">
          <span className="inline-spinner" aria-hidden="true" /> Loading commit history…
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="analytics-section" aria-label="Commit Activity">
        <h3 className="section-title">Commit Activity</h3>
        <p className="analytics-error" role="alert">
          ⚠️ Could not load commit history: {error}
        </p>
      </section>
    );
  }

  const { chartData, peakCount, totalCommits, trend } = transformCommitActivity(commits);

  if (!commits || commits.length === 0 || chartData.length === 0) {
    return (
      <section className="analytics-section" aria-label="Commit Activity">
        <h3 className="section-title">Commit Activity</h3>
        <p className="analytics-empty">
          📭 No recent commit activity recorded for this repository.
        </p>
      </section>
    );
  }

  const trendClass =
    trend === 'High Activity'
      ? 'trend-badge trend-high'
      : trend === 'Moderate Activity'
      ? 'trend-badge trend-moderate'
      : 'trend-badge trend-low';

  return (
    <section className="analytics-section" aria-label="Commit Activity">
      <div className="section-header">
        <h3 className="section-title">Commit Activity</h3>
        <span className={trendClass}>{trend}</span>
      </div>

      {/* Summary Stats */}
      <div className="commit-summary-bar" role="group" aria-label="Commit summary statistics">
        <div className="summary-item">
          <span className="summary-label">Recent Commits</span>
          <span className="summary-value" aria-label={`${totalCommits} recent commits`}>{totalCommits}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Peak Day</span>
          <span className="summary-value" aria-label={`Peak ${peakCount} commits in one day`}>{peakCount}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Active Days</span>
          <span className="summary-value" aria-label={`${chartData.length} active days`}>{chartData.length}</span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="commit-chart-wrapper">
        <div
          className="commit-bar-chart"
          role="img"
          aria-label={`Commit activity chart — ${totalCommits} commits across ${chartData.length} days`}
        >
          {chartData.map((item) => (
            <div
              key={item.date}
              className="chart-bar-column"
              title={`${item.date}: ${item.count} commit${item.count !== 1 ? 's' : ''}`}
            >
              <div className="bar-wrapper">
                {item.count > 0 && (
                  <span className="bar-count-tooltip" aria-hidden="true">{item.count}</span>
                )}
                <div
                  className={`chart-bar${item.count === peakCount && peakCount > 0 ? ' peak-bar' : ''}`}
                  style={{ height: `${Math.max(item.heightPercentage, item.count > 0 ? 4 : 0)}%` }}
                />
              </div>
              <span className="chart-label" aria-hidden="true">{item.label}</span>
            </div>
          ))}
        </div>
        <p className="chart-caption">
          Showing commits per day — peak day highlighted in green
        </p>
      </div>
    </section>
  );
}
