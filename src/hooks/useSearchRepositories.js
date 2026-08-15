import { useState, useEffect, useCallback, useRef } from 'react';
import { searchRepositories } from '../services/githubApi';
import { useDebounce } from './useDebounce';

/**
 * Custom hook for managing GitHub repository search state.
 * Implements debounced auto-search and manual execution without duplicate requests.
 */
export function useSearchRepositories(initialQuery = 'react', delay = 500) {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Ref to track the query that was last fetched to prevent duplicate requests
  const lastFetchedQueryRef = useRef('');

  // Debounce the raw input search term
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  // Core search fetch function
  const fetchRepositories = useCallback(async (query, forceFetch = false) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setRepositories([]);
      setLoading(false);
      setError(null);
      setHasSearched(false);
      lastFetchedQueryRef.current = '';
      return;
    }

    // Skip if query is identical to last fetched query unless explicitly forced (e.g. retry)
    if (!forceFetch && trimmedQuery === lastFetchedQueryRef.current) {
      return;
    }

    lastFetchedQueryRef.current = trimmedQuery;
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await searchRepositories(trimmedQuery);
      setRepositories(data.items || []);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message || 'Failed to fetch repositories.');
      setRepositories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Trigger search whenever debounced search term changes
  useEffect(() => {
    fetchRepositories(debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchRepositories]);

  // Immediate manual search execution (e.g. form submit or quick tag click)
  const executeSearch = useCallback((query) => {
    setSearchTerm(query);
    fetchRepositories(query);
  }, [fetchRepositories]);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    repositories,
    loading,
    error,
    hasSearched,
    executeSearch,
    retrySearch: () => fetchRepositories(searchTerm, true)
  };
}
