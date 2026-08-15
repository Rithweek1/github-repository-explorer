import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getRepositoryDetails,
  getRepositoryLanguages,
  getRepositoryCommits,
  getRepositoryContributors
} from '../services/githubApi';
import { calculateLanguagePercentages } from '../utils/dataTransformations';

/**
 * Custom hook for managing repository details and analytics metrics.
 * Uses AbortController to cancel stale/pending requests on unmount or route change.
 */
export function useRepositoryDetails(owner, repo) {
  const [details, setDetails] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [commits, setCommits] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [contributorPage, setContributorPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [languagesLoading, setLanguagesLoading] = useState(false);
  const [commitsLoading, setCommitsLoading] = useState(false);
  const [contributorsLoading, setContributorsLoading] = useState(false);

  const [error, setError] = useState(null);
  const [languagesError, setLanguagesError] = useState(null);
  const [commitsError, setCommitsError] = useState(null);
  const [contributorsError, setContributorsError] = useState(null);

  // Store active AbortController ref for contributor pagination
  const paginationAbortControllerRef = useRef(null);

  // Fetch core metrics and details with AbortController signal
  useEffect(() => {
    if (!owner || !repo) return;

    const controller = new AbortController();
    const { signal } = controller;

    setLoading(true);
    setLanguagesLoading(true);
    setCommitsLoading(true);
    setContributorsLoading(true);

    setError(null);
    setLanguagesError(null);
    setCommitsError(null);
    setContributorsError(null);
    setContributorPage(1);

    async function loadAllRepoData() {
      // 1. Fetch core details
      try {
        const detailsData = await getRepositoryDetails(owner, repo, signal);
        if (!signal.aborted) {
          setDetails(detailsData);
          setLoading(false);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        setDetails(null);
        setError(err.message || 'Failed to load repository details.');
        setLoading(false);
        setLanguagesLoading(false);
        setCommitsLoading(false);
        setContributorsLoading(false);
        return; // Stop further updates if core repo load fails
      }

      // 2. Fetch languages
      getRepositoryLanguages(owner, repo, signal)
        .then((raw) => {
          if (!signal.aborted) setLanguages(calculateLanguagePercentages(raw));
        })
        .catch((err) => {
          if (err.name !== 'AbortError') setLanguagesError(err.message);
        })
        .finally(() => {
          if (!signal.aborted) setLanguagesLoading(false);
        });

      // 3. Fetch commits
      getRepositoryCommits(owner, repo, 1, 30, signal)
        .then((data) => {
          if (!signal.aborted) setCommits(data);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') setCommitsError(err.message);
        })
        .finally(() => {
          if (!signal.aborted) setCommitsLoading(false);
        });

      // 4. Fetch contributors (page 1)
      getRepositoryContributors(owner, repo, 1, 10, signal)
        .then((data) => {
          if (!signal.aborted) setContributors(data);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') setContributorsError(err.message);
        })
        .finally(() => {
          if (!signal.aborted) setContributorsLoading(false);
        });
    }

    loadAllRepoData();

    // Cleanup: Abort any pending HTTP requests when owner/repo changes or hook unmounts
    return () => {
      controller.abort();
    };
  }, [owner, repo]);

  // Handle contributor pagination with AbortController
  const changeContributorPage = useCallback((newPage) => {
    if (newPage < 1 || !owner || !repo) return;

    if (paginationAbortControllerRef.current) {
      paginationAbortControllerRef.current.abort();
    }

    const controller = new AbortController();
    paginationAbortControllerRef.current = controller;

    setContributorPage(newPage);
    setContributorsLoading(true);
    setContributorsError(null);

    getRepositoryContributors(owner, repo, newPage, 10, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setContributors(data);
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setContributorsError(err.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setContributorsLoading(false);
        }
      });
  }, [owner, repo]);

  return {
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
    changeContributorPage
  };
}
