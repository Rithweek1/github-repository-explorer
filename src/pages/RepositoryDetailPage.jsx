import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRepositoryDetails } from '../hooks/useRepositoryDetails';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { LanguageStats } from '../components/repository/LanguageStats';
import { CommitActivity } from '../components/repository/CommitActivity';
import { ContributorsList } from '../components/repository/ContributorsList';
import { formatNumber, formatDate } from '../utils/formatters';

export function RepositoryDetailPage() {
  const { owner, repo } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const {
    details,
    loading,
    error,
    languages,
    languagesLoading,
    languagesError,
    commits,
    commitsLoading,
    commitsError,
    contributors,
    contributorsLoading,
    contributorsError,
    contributorPage,
    changeContributorPage,
    refetchAll
  } = useRepositoryDetails(owner, repo);

  if (loading) {
    return (
      <div className="page-container repository-detail-page">
        <div className="back-navigation">
          <Link to="/" className="back-link">
            ← Back to Search
          </Link>
        </div>
        <LoadingSpinner message={`Loading analytics for ${owner}/${repo}...`} />
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="page-container repository-detail-page">
        <div className="back-navigation">
          <Link to="/" className="back-link">
            ← Back to Search
          </Link>
        </div>
        <ErrorMessage
          title="Repository Not Found"
          message={error || `Could not find repository "${owner}/${repo}". Please check the repository name or owner.`}
          onRetry={refetchAll}
        />
      </div>
    );
  }

  const {
    name,
    owner: ownerData,
    description,
    stargazers_count,
    forks_count,
    open_issues_count,
    language,
    license,
    created_at,
    updated_at,
    html_url
  } = details;

  return (
    <div className="page-container repository-detail-page">
      <div className="back-navigation">
        <Link to="/" className="back-link">
          ← Back to Search
        </Link>
      </div>

      {/* Main Header & Overview Card */}
      <div className="repo-detail-card">
        <div className="repo-detail-header">
          <div className="owner-brand">
            {ownerData?.avatar_url && (
              <img
                src={ownerData.avatar_url}
                alt={`${ownerData.login}'s avatar`}
                className="detail-owner-avatar"
              />
            )}
            <div className="title-group">
              <span className="owner-name-prefix">{ownerData?.login || owner}</span>
              <h1 className="detail-repo-name">{name}</h1>
            </div>
          </div>

          <a
            href={html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn primary-btn github-external-btn"
          >
            Open on GitHub ↗
          </a>
        </div>

        <p className="detail-description">
          {description || 'No description provided for this repository.'}
        </p>

        {/* Quick Stat Badges */}
        <div className="metrics-grid">
          <div className="metric-card">
            <span className="metric-icon">⭐</span>
            <div className="metric-info">
              <span className="metric-label">Stars</span>
              <span className="metric-value">{formatNumber(stargazers_count)}</span>
            </div>
          </div>

          <div className="metric-card">
            <span className="metric-icon">🍴</span>
            <div className="metric-info">
              <span className="metric-label">Forks</span>
              <span className="metric-value">{formatNumber(forks_count)}</span>
            </div>
          </div>

          <div className="metric-card">
            <span className="metric-icon">🐞</span>
            <div className="metric-info">
              <span className="metric-label">Open Issues</span>
              <span className="metric-value">{formatNumber(open_issues_count)}</span>
            </div>
          </div>

          <div className="metric-card">
            <span className="metric-icon">💻</span>
            <div className="metric-info">
              <span className="metric-label">Primary Language</span>
              <span className="metric-value">{language || 'Not specified'}</span>
            </div>
          </div>

          <div className="metric-card">
            <span className="metric-icon">📜</span>
            <div className="metric-info">
              <span className="metric-label">License</span>
              <span className="metric-value">
                {license?.spdx_id || license?.name || 'No License'}
              </span>
            </div>
          </div>

          <div className="metric-card">
            <span className="metric-icon">📅</span>
            <div className="metric-info">
              <span className="metric-label">Created On</span>
              <span className="metric-value">{formatDate(created_at)}</span>
            </div>
          </div>

          <div className="metric-card">
            <span className="metric-icon">🔄</span>
            <div className="metric-info">
              <span className="metric-label">Last Updated</span>
              <span className="metric-value">{formatDate(updated_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for Analytics Sections */}
      <div className="analytics-tabs-wrapper">
        <div className="tabs-header">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 All Analytics
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'languages' ? 'active' : ''}`}
            onClick={() => setActiveTab('languages')}
          >
            💻 Languages ({languages.length})
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'commits' ? 'active' : ''}`}
            onClick={() => setActiveTab('commits')}
          >
            📈 Commits ({commits.length})
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'contributors' ? 'active' : ''}`}
            onClick={() => setActiveTab('contributors')}
          >
            👥 Contributors
          </button>
        </div>

        <div className="tabs-content">
          {(activeTab === 'overview' || activeTab === 'languages') && (
            <LanguageStats
              languages={languages}
              loading={languagesLoading}
              error={languagesError}
            />
          )}

          {(activeTab === 'overview' || activeTab === 'commits') && (
            <CommitActivity
              commits={commits}
              loading={commitsLoading}
              error={commitsError}
            />
          )}

          {(activeTab === 'overview' || activeTab === 'contributors') && (
            <ContributorsList
              contributors={contributors}
              loading={contributorsLoading}
              error={contributorsError}
              currentPage={contributorPage}
              onPageChange={changeContributorPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
