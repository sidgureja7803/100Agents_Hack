import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { RepositoryInput } from '@/components/RepositoryInput';
import { TechStackSelector } from '@/components/TechStackSelector';
import { OutputDisplay } from '@/components/OutputDisplay';
import { ChatPanel } from '@/components/ChatPanel';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, LogOut, User, Settings, History } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DevPilotAPI, DevPilotResponse } from '@/lib/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [repoUrl, setRepoUrl] = useState('');
  const [techStack, setTechStack] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [apiResponse, setApiResponse] = useState<DevPilotResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!repoUrl || !techStack || !user) return;
    
    setIsGenerating(true);
    setShowOutput(false);
    setShowChat(false);
    setError(null);
    
    try {
      // Call the real API with user ID
      const response = await DevPilotAPI.generateCICD(repoUrl, techStack, user.$id);
      setApiResponse(response);
      setShowOutput(true);
      setShowChat(true);
    } catch (err) {
      console.error('Generation failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate CI/CD setup. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
                DevPilotAI
              </h1>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Dashboard
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline text-sm text-slate-600">
                Welcome back, {user?.name}
              </span>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {user?.name ? getUserInitials(user.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <History className="mr-2 h-4 w-4" />
                    Generation History
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Card */}
          <Card className="bg-gradient-to-r from-blue-50 to-slate-50 border-blue-200/60">
            <CardHeader>
              <CardTitle className="text-xl">Ready to automate your DevOps?</CardTitle>
              <CardDescription>
                Enter your GitHub repository URL and select your tech stack to generate production-ready CI/CD configurations.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Input Section */}
          <Card className="shadow-lg border-slate-200/60">
            <CardHeader>
              <CardTitle>Generate CI/CD Setup</CardTitle>
              <CardDescription>
                Provide your repository details to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RepositoryInput 
                value={repoUrl} 
                onChange={setRepoUrl}
                placeholder="https://github.com/username/repository"
              />
              
              <TechStackSelector 
                value={techStack} 
                onChange={setTechStack}
              />
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Button 
                onClick={handleGenerate}
                disabled={!repoUrl || !techStack || isGenerating}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating CI/CD Setup...
                  </>
                ) : (
                  'Generate CI/CD Setup'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          {showOutput && apiResponse && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
              <div className="lg:col-span-2">
                <OutputDisplay 
                  techStack={techStack} 
                  apiResponse={apiResponse}
                />
              </div>
              {showChat && (
                <div className="lg:col-span-1">
                  <ChatPanel />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 