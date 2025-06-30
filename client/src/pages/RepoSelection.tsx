import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useGitHub } from '@/contexts/GitHubContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Search, GitBranch, Github, Globe, Link, Users } from 'lucide-react';
import { TechStackSelector } from '@/components/TechStackSelector';
import { RepositorySelector } from '@/components/RepositorySelector';
import { useToast } from '@/hooks/use-toast';

export const RepoSelection = () => {
  const { user } = useAuth();
  const { isConnected, token, connectGitHub } = useGitHub();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [repoUrl, setRepoUrl] = useState('');
  const [selectedRepository, setSelectedRepository] = useState<any>(null);
  const [selectedTechStack, setSelectedTechStack] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');

  const validateGitHubUrl = (url: string) => {
    const githubRegex = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+\/?$/;
    return githubRegex.test(url);
  };

  const handleRepositorySelect = (repository: any) => {
    setSelectedRepository(repository);
    toast({
      title: 'Repository Selected',
      description: `Selected ${repository.fullName}`,
    });
  };

  const handleGenerateCI = async () => {
    let repositoryData = null;
    let finalRepoUrl = '';

    // Determine which repository source to use
    if (activeTab === 'browse' && selectedRepository) {
      repositoryData = selectedRepository;
      finalRepoUrl = selectedRepository.cloneUrl;
    } else if (activeTab === 'manual' && repoUrl.trim()) {
      if (!validateGitHubUrl(repoUrl.trim())) {
        toast({
          title: 'Error',
          description: 'Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo).',
          variant: 'destructive',
        });
        return;
      }
      finalRepoUrl = repoUrl.trim();
    } else {
      toast({
        title: 'Error',
        description: 'Please select a repository or enter a repository URL.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Clone repository using the new backend endpoint
      const cloneResponse = await fetch('http://localhost:3001/api/clone-repo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          repoUrl: finalRepoUrl,
          repositoryData
        }),
      });

      if (!cloneResponse.ok) {
        throw new Error('Failed to clone repository');
      }

      const cloneData = await cloneResponse.json();
      
      // Start analysis
      const analyzeResponse = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: cloneData.sessionId
        }),
      });

      if (!analyzeResponse.ok) {
        throw new Error('Failed to start analysis');
      }

      toast({
        title: 'Success',
        description: 'Repository analysis started! Redirecting to dashboard...',
      });

      // Redirect to dashboard with session ID
      navigate(`/dashboard?session=${cloneData.sessionId}`);
      
    } catch (error) {
      console.error('Error generating CI/CD:', error);
      toast({
        title: 'Error',
        description: 'Failed to process repository. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const exampleRepos = [
    {
      name: 'react-todo-app',
      url: 'https://github.com/example/react-todo-app',
      description: 'A modern React todo application with TypeScript',
      language: 'TypeScript',
      techStack: 'react'
    },
    {
      name: 'node-api-server',
      url: 'https://github.com/example/node-api-server',
      description: 'RESTful API server built with Node.js and Express',
      language: 'JavaScript',
      techStack: 'node'
    },
    {
      name: 'python-ml-project',
      url: 'https://github.com/example/python-ml-project',
      description: 'Machine learning project with FastAPI backend',
      language: 'Python',
      techStack: 'python'
    }
  ];

  const handleExampleSelect = (example: typeof exampleRepos[0]) => {
    setRepoUrl(example.url);
    setSelectedTechStack(example.techStack);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Repository Selection</h1>
          <p className="text-slate-600 mt-2">
            Enter a GitHub repository URL to generate CI/CD configuration
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Repository Selection Tabs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                Select Repository
              </CardTitle>
              <CardDescription>
                Browse your GitHub repositories or enter a manual URL for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="browse" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Browse Repositories
                  </TabsTrigger>
                  <TabsTrigger value="manual" className="flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    Manual URL
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="browse" className="mt-6">
                  <RepositorySelector
                    onRepositorySelect={handleRepositorySelect}
                    isConnected={isConnected}
                    userToken={token}
                    onConnect={connectGitHub}
                  />
                  {selectedRepository && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Selected Repository:</h4>
                      <div className="flex items-center gap-2">
                        <Github className="h-4 w-4" />
                        <span className="font-mono text-sm">{selectedRepository.fullName}</span>
                        {selectedRepository.private && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Private</span>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="manual" className="mt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="repo-url" className="text-sm font-medium text-slate-700">
                        Repository URL
                      </label>
                      <Input
                        id="repo-url"
                        type="url"
                        placeholder="https://github.com/username/repository"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        className="w-full"
                      />
                      <p className="text-xs text-slate-500">
                        Example: https://github.com/facebook/react
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6">
                <Button
                  onClick={handleGenerateCI}
                  disabled={loading || (activeTab === 'browse' && !selectedRepository) || (activeTab === 'manual' && !repoUrl.trim())}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing Repository...
                    </>
                  ) : (
                    <>
                      Start AI Analysis
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Example Repositories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Example Repositories</CardTitle>
              <CardDescription>
                Try these example repositories to see the CI/CD generation in action
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {exampleRepos.map((example, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => handleExampleSelect(example)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-4 w-4 text-slate-500" />
                        <span className="font-medium text-slate-900">{example.name}</span>
                        <span className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-600">
                          {example.language}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{example.description}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Use This
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* GitHub Connection Notice */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900">Repository Access</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Currently supporting public GitHub repositories. For private repositories, 
                    you can still generate CI/CD configurations by entering the repository URL.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 