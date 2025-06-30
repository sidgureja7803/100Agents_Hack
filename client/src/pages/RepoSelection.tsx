import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, GitBranch, ArrowRight } from 'lucide-react';
import { TechStackSelector } from '@/components/TechStackSelector';
import { useToast } from '@/hooks/use-toast';

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  clone_url: string;
  fork: boolean;
  created_at: string;
  updated_at: string;
  language: string;
}

export const RepoSelection = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedTechStack, setSelectedTechStack] = useState('');

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const token = await user?.getToken('github');
        if (!token) {
          toast({
            title: 'Error',
            description: 'Failed to get GitHub token. Please try logging in again.',
            variant: 'destructive',
          });
          return;
        }

        const response = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }

        const data = await response.json();
        const nonForkedRepos = data.filter((repo: Repository) => !repo.fork);
        setRepositories(nonForkedRepos);
        setFilteredRepos(nonForkedRepos);
      } catch (error) {
        console.error('Error fetching repositories:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch repositories. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, [user, toast]);

  useEffect(() => {
    const filtered = repositories.filter(repo =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRepos(filtered);
  }, [searchTerm, repositories]);

  const handleGenerateCI = async (repo: Repository) => {
    if (!selectedTechStack) {
      toast({
        title: 'Error',
        description: 'Please select a technology stack first.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/generate-cicd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repoUrl: repo.clone_url,
          techStack: selectedTechStack,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate CI/CD configuration');
      }

      toast({
        title: 'Success',
        description: 'CI/CD configuration generated successfully!',
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error generating CI/CD:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate CI/CD configuration. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-12 bg-slate-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Select Repository</h1>
          <p className="text-slate-600 mt-2">
            Choose a repository to generate CI/CD configuration
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search repositories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <TechStackSelector
                value={selectedTechStack}
                onChange={setSelectedTechStack}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRepos.map((repo) => (
              <Card key={repo.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-slate-600" />
                    {repo.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {repo.description || 'No description available'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-slate-600">
                      <p>Language: {repo.language || 'Not specified'}</p>
                      <p>Last updated: {new Date(repo.updated_at).toLocaleDateString()}</p>
                    </div>
                    <Button
                      onClick={() => handleGenerateCI(repo)}
                      disabled={!selectedTechStack}
                      className="w-full"
                    >
                      Generate CI/CD
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRepos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600">No repositories found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 