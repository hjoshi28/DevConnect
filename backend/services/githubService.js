import axios from 'axios';

// Base URL for GitHub API
const GITHUB_API_URL = 'https://api.github.com';

export const getGithubStats = async (username) => {
  try {
    // Basic headers, can add authorization if token is available to increase rate limits
    const headers = {
      Accept: 'application/vnd.github.v3+json'
    };

    // Fetch user profile data
    const userRes = await axios.get(`${GITHUB_API_URL}/users/${username}`, { headers });
    const userData = userRes.data;

    // Fetch repositories
    const reposRes = await axios.get(`${GITHUB_API_URL}/users/${username}/repos?per_page=100&sort=pushed`, { headers });
    const repos = reposRes.data;

    // Calculate aggregated stats
    let totalStars = 0;
    let totalForks = 0;
    const languages = {};

    repos.forEach(repo => {
      totalStars += repo.stargazers_count;
      totalForks += repo.forks_count;

      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    // Format top languages
    const topLanguages = Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    return {
      success: true,
      data: {
        username: userData.login,
        name: userData.name,
        avatar_url: userData.avatar_url,
        public_repos: userData.public_repos,
        followers: userData.followers,
        totalStars,
        totalForks,
        topLanguages,
        topRepos: repos.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 5).map(r => ({
          name: r.name,
          stars: r.stargazers_count,
          url: r.html_url,
          description: r.description
        }))
      }
    };

  } catch (error) {
    console.error('Error fetching GitHub stats:', error.response?.data?.message || error.message);
    return {
      success: false,
      message: error.response?.status === 404 ? 'GitHub user not found' : 'Failed to fetch GitHub data'
    };
  }
};
