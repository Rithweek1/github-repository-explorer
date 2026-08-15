import React from 'react';
import { useSearchRepositories } from '../hooks/useSearchRepositories';
import { RepoSearchInput } from '../components/repository/RepoSearchInput';
import { RepoList } from '../components/repository/RepoList';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { EmptyState } from '../components/common/EmptyState';

export function HomePage() {
  const {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    repositories,
    loading,
    error,
    hasSearched,
    executeSearch
  } = useSearchRepositories('react');

  return (
    <div className="page-container home-page">
      <section className="hero-section">
        <h1 className="hero-title">GitHub Repository Explorer</h1>
        <p className="hero-subtitle">
          Search for GitHub repositories by name or topic to view language statistics, commits, and contributors.
        </p>

        <RepoSearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          onSubmit={executeSearch}
          loading={loading}
        />
      </section>

      <section className="results-section">
        {loading && <LoadingSpinner message={`Searching repositories matching "${searchTerm}"...`} />}

        {!loading && error && (
          <ErrorMessage
            title="Search Failed"
            message={error}
            onRetry={() => executeSearch(searchTerm)}
          />
        )}

        {!loading && !error && hasSearched && repositories.length === 0 && (
          <EmptyState
            icon="🔎"
            title="No Repositories Found"
            message={`We couldn't find any public GitHub repositories matching "${debouncedSearchTerm}". Try a different search term.`}
          />
        )}

        {!loading && !error && repositories.length > 0 && (
          <>
            <div className="results-header">
              <h2>Found Repositories ({repositories.length})</h2>
              <span className="search-query-badge">Query: "{debouncedSearchTerm}"</span>
            </div>
            <RepoList repositories={repositories} />
          </>
        )}
      </section>
    </div>
  );
}
