import React from 'react';
import { RepoCard } from './RepoCard';

/**
 * Repository List Grid component.
 */
export function RepoList({ repositories }) {
  return (
    <div className="repo-grid">
      {repositories.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  );
}
