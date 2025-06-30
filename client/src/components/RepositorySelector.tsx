import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Github, 
  Search, 
  ExternalLink, 
  Star, 
  GitBranch, 
  Lock, 
  Globe, 
  Calendar,
  User,
  Building
} from 'lucide-react';

interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string;
  private: boolean;
  htmlUrl: string;
  cloneUrl: string;
  sshUrl: string;
  language: string;
  stargazersCount: number;
  forksCount: number;
  updatedAt: string;
  defaultBranch: string;
  owner: {
    login: string;
    avatarUrl: string;
  };
}

interface Organization {
  id: number;
  login: string;
  description: string;
  avatarUrl: string;
  url: string;
}

interface RepositorySelectorProps {
  onRepositorySelect: (repository: Repository) => void;
  isConnected: boolean;
  userToken: string | null;
  onConnect: () => void;
}

export const RepositorySelector: React.FC<RepositorySelectorProps> = ({
  onRepositorySelect,
  isConnected,
  userToken,
  onConnect
}) => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Fetch user repositories
  const fetchRepositories = async (page = 1, orgName = '') => {
    if (!userToken) return;

    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const endpoint = orgName 
        ? `/api/github/organizations/${orgName}/repositories?page=${page}&per_page=20`
        : `/api/github/repositories?page=${page}&per_page=20`;

      const response = await fetch(`${apiUrl}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }

      const data = await response.json();

      if (page === 1) {
        setRepositories(data.repositories);
        if (!orgName) {
          setUser(data.user);
          setOrganizations(data.organizations);
        }
      } else {
        setRepositories(prev => [...prev, ...data.repositories]);
      }

      setHasMore(data.pagination.has_more);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      setError('Failed to fetch repositories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load repositories when connected
  useEffect(() => {
    if (isConnected && userToken) {
      fetchRepositories(1, selectedOrg);
    }
  }, [isConnected, userToken, selectedOrg]);

  // Filter repositories based on search term
  const filteredRepositories = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Load more repositories
  const loadMore = () => {
    if (!loading && hasMore) {
      fetchRepositories(currentPage + 1, selectedOrg);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isConnected) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Github className="h-6 w-6" />
            Connect GitHub Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Github className="h-4 w-4" />
            <AlertDescription>
              Connect your GitHub account to browse and select your repositories for AI analysis.
            </AlertDescription>
          </Alert>
          <Button 
            onClick={onConnect} 
            className="w-full"
            size="lg"
          >
            <Github className="mr-2 h-5 w-5" />
            Connect GitHub Account
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Info */}
      {user && (
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatarUrl} alt={user.name || user.login} />
              <AvatarFallback>{user.name?.[0] || user.login?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold">{user.name || user.login}</h3>
              <p className="text-sm text-muted-foreground">@{user.login}</p>
            </div>
            <Badge variant="outline" className="gap-1">
              <Github className="h-3 w-3" />
              Connected
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* Repository Browser */}
      <Card>
        <CardHeader>
          <CardTitle>Select Repository</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">Search repositories</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search repositories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Organization filter */}
            {organizations.length > 0 && (
              <div className="w-full sm:w-64">
                <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                  <SelectTrigger>
                    <SelectValue placeholder="All repositories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Personal repositories
                      </div>
                    </SelectItem>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.login}>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          {org.login}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert className="mb-4" variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading && repositories.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading repositories...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRepositories.length === 0 ? (
                <div className="text-center py-12">
                  <Github className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? 'No repositories match your search.' : 'No repositories found.'}
                  </p>
                </div>
              ) : (
                <>
                  {filteredRepositories.map((repo) => (
                    <div
                      key={repo.id}
                      className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => onRepositorySelect(repo)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium truncate">{repo.name}</h4>
                            {repo.private ? (
                              <Badge variant="secondary" className="gap-1">
                                <Lock className="h-3 w-3" />
                                Private
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="gap-1">
                                <Globe className="h-3 w-3" />
                                Public
                              </Badge>
                            )}
                            {repo.language && (
                              <Badge variant="outline">{repo.language}</Badge>
                            )}
                          </div>
                          {repo.description && (
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {repo.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {repo.stargazersCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <GitBranch className="h-3 w-3" />
                              {repo.forksCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Updated {formatDate(repo.updatedAt)}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-4">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {hasMore && (
                    <div className="text-center pt-4">
                      <Button 
                        variant="outline" 
                        onClick={loadMore} 
                        disabled={loading}
                      >
                        {loading ? 'Loading...' : 'Load More'}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RepositorySelector; 