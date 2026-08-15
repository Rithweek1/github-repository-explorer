/**
 * GitHub API Service Module
 * Handles all direct HTTP requests to the GitHub REST API v3 using native fetch.
 * Supports AbortSignal for request cancellation and cleanup.
 */

const BASE_URL = 'https://api.github.com';

/**
 * Helper function for handling HTTP responses and throwing clear error messages.
 */
async function handleResponse(response) {
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again in a few minutes.');
    }
    if (response.status === 404) {
      throw new Error('Requested resource not found on GitHub.');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `GitHub API error: ${response.status}`);
  }
  return response.json();
}

/**
 * Search repositories matching a search query.
 */
export async function searchRepositories(query, sort = 'stars', page = 1, signal) {
  if (!query) return { items: [], total_count: 0 };
  const url = `${BASE_URL}/search/repositories?q=${encodeURIComponent(query)}&sort=${sort}&page=${page}&per_page=12`;
  return handleResponse(await fetch(url, { signal }));
}

/**
 * Get core repository metadata.
 */
export async function getRepositoryDetails(owner, repo, signal) {
  const url = `${BASE_URL}/repos/${owner}/${repo}`;
  return handleResponse(await fetch(url, { signal }));
}

/**
 * Get repository programming language breakdown (bytes per language).
 */
export async function getRepositoryLanguages(owner, repo, signal) {
  const url = `${BASE_URL}/repos/${owner}/${repo}/languages`;
  return handleResponse(await fetch(url, { signal }));
}

/**
 * Get recent commits list for a repository.
 */
export async function getRepositoryCommits(owner, repo, page = 1, perPage = 30, signal) {
  const url = `${BASE_URL}/repos/${owner}/${repo}/commits?per_page=${perPage}&page=${page}`;
  return handleResponse(await fetch(url, { signal }));
}

/**
 * Get contributors for a repository with pagination support.
 */
export async function getRepositoryContributors(owner, repo, page = 1, perPage = 10, signal) {
  const url = `${BASE_URL}/repos/${owner}/${repo}/contributors?per_page=${perPage}&page=${page}`;
  return handleResponse(await fetch(url, { signal }));
}
