/**
 * Language color map matching common GitHub language colors.
 */
const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Shell: '#89e051',
  Vue: '#41b883',
  Dockerfile: '#384d54'
};

/**
 * Transform language byte counts into relative percentage statistics with color assignment.
 * @param {Object} languageBytes Key-value pair of language name to byte count.
 * @returns {Array<{name: string, percentage: number, bytes: number, color: string}>}
 */
export function calculateLanguagePercentages(languageBytes = {}) {
  const totalBytes = Object.values(languageBytes).reduce((acc, bytes) => acc + bytes, 0);

  if (!languageBytes || totalBytes === 0) return [];

  const defaultColors = ['#58a6ff', '#3fb950', '#d29922', '#db6d28', '#f85149', '#a371f7'];

  return Object.entries(languageBytes)
    .map(([name, bytes], index) => {
      const percentage = parseFloat(((bytes / totalBytes) * 100).toFixed(1));
      const color = LANGUAGE_COLORS[name] || defaultColors[index % defaultColors.length];
      return {
        name,
        bytes,
        percentage,
        color
      };
    })
    .sort((a, b) => b.bytes - a.bytes);
}

/**
 * Transform raw commit objects into a timeline dataset for activity visualization.
 * Group commits by date and compute peak activity, total commits, and height percentages for chart bars.
 *
 * @param {Array} commits Raw commit array from GitHub API
 * @returns {Object} { chartData: Array, peakCount: number, totalCommits: number, trend: string }
 */
export function transformCommitActivity(commits = []) {
  if (!Array.isArray(commits) || commits.length === 0) {
    return {
      chartData: [],
      peakCount: 0,
      totalCommits: 0,
      trend: 'No recent activity'
    };
  }

  // Map to store date -> count
  const dateCounts = {};

  commits.forEach((item) => {
    const commitDateStr = item.commit?.author?.date || item.commit?.committer?.date;
    if (commitDateStr) {
      const dateKey = commitDateStr.split('T')[0]; // YYYY-MM-DD
      dateCounts[dateKey] = (dateCounts[dateKey] || 0) + 1;
    }
  });

  // Sort dates chronologically
  const sortedDates = Object.keys(dateCounts).sort();

  if (sortedDates.length === 0) {
    return { chartData: [], peakCount: 0, totalCommits: 0, trend: 'No recent activity' };
  }

  const counts = Object.values(dateCounts);
  const peakCount = Math.max(...counts, 1);
  const totalCommits = commits.length;

  const chartData = sortedDates.map((dateKey) => {
    const count = dateCounts[dateKey];
    const dateObj = new Date(dateKey);
    const label = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
    const heightPercentage = Math.round((count / peakCount) * 100);

    return {
      date: dateKey,
      label,
      count,
      heightPercentage: Math.max(heightPercentage, 12) // Minimum bar height for visibility
    };
  });

  // Calculate trend heuristic
  let trend = 'Moderate Activity';
  if (totalCommits >= 25) {
    trend = 'High Activity (Frequent Commits)';
  } else if (totalCommits <= 5) {
    trend = 'Low Activity';
  }

  return {
    chartData,
    peakCount,
    totalCommits,
    trend
  };
}
