import axios from 'axios';
import jwt from 'jsonwebtoken';

class GitHubService {
  constructor() {
    this.clientId = process.env.GITHUB_CLIENT_ID;
    this.clientSecret = process.env.GITHUB_CLIENT_SECRET;
    this.redirectUri = process.env.GITHUB_REDIRECT_URI;
    this.jwtSecret = process.env.JWT_SECRET || 'your-jwt-secret-change-in-production';
  }

  // Generate GitHub OAuth URL
  getAuthURL(state = '') {
    const scopes = 'repo,user:email';
    return `https://github.com/login/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=${scopes}&state=${state}`;
  }

  // Exchange authorization code for access token
  async getAccessToken(code) {
    try {
      const response = await axios.post('https://github.com/login/oauth/access_token', {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: code,
        redirect_uri: this.redirectUri
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      return response.data.access_token;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw new Error('Failed to authenticate with GitHub');
    }
  }

  // Get user information from GitHub
  async getUserInfo(accessToken) {
    try {
      const response = await axios.get('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw new Error('Failed to fetch user information');
    }
  }

  // Get user repositories
  async getUserRepositories(accessToken, page = 1, perPage = 50) {
    try {
      const response = await axios.get(`https://api.github.com/user/repos`, {
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        },
        params: {
          page: page,
          per_page: perPage,
          sort: 'updated',
          type: 'all'
        }
      });

      return response.data.map(repo => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        private: repo.private,
        htmlUrl: repo.html_url,
        cloneUrl: repo.clone_url,
        sshUrl: repo.ssh_url,
        language: repo.language,
        stargazersCount: repo.stargazers_count,
        forksCount: repo.forks_count,
        updatedAt: repo.updated_at,
        defaultBranch: repo.default_branch,
        owner: {
          login: repo.owner.login,
          avatarUrl: repo.owner.avatar_url
        }
      }));
    } catch (error) {
      console.error('Error fetching repositories:', error);
      throw new Error('Failed to fetch repositories');
    }
  }

  // Get organization repositories
  async getOrgRepositories(accessToken, org, page = 1, perPage = 50) {
    try {
      const response = await axios.get(`https://api.github.com/orgs/${org}/repos`, {
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        },
        params: {
          page: page,
          per_page: perPage,
          sort: 'updated',
          type: 'all'
        }
      });

      return response.data.map(repo => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        private: repo.private,
        htmlUrl: repo.html_url,
        cloneUrl: repo.clone_url,
        sshUrl: repo.ssh_url,
        language: repo.language,
        stargazersCount: repo.stargazers_count,
        forksCount: repo.forks_count,
        updatedAt: repo.updated_at,
        defaultBranch: repo.default_branch,
        owner: {
          login: repo.owner.login,
          avatarUrl: repo.owner.avatar_url
        }
      }));
    } catch (error) {
      console.error('Error fetching org repositories:', error);
      throw new Error('Failed to fetch organization repositories');
    }
  }

  // Get user organizations
  async getUserOrganizations(accessToken) {
    try {
      const response = await axios.get('https://api.github.com/user/orgs', {
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      return response.data.map(org => ({
        id: org.id,
        login: org.login,
        description: org.description,
        avatarUrl: org.avatar_url,
        url: org.url
      }));
    } catch (error) {
      console.error('Error fetching organizations:', error);
      throw new Error('Failed to fetch organizations');
    }
  }

  // Generate JWT token for user session
  generateJWT(userData) {
    return jwt.sign(userData, this.jwtSecret, { expiresIn: '7d' });
  }

  // Verify JWT token
  verifyJWT(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Check if user has access to repository
  async checkRepoAccess(accessToken, owner, repo) {
    try {
      const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      return {
        hasAccess: true,
        repo: {
          id: response.data.id,
          name: response.data.name,
          fullName: response.data.full_name,
          private: response.data.private,
          cloneUrl: response.data.clone_url,
          sshUrl: response.data.ssh_url,
          defaultBranch: response.data.default_branch
        }
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return { hasAccess: false, error: 'Repository not found or no access' };
      }
      throw new Error('Failed to check repository access');
    }
  }
}

export default new GitHubService(); 