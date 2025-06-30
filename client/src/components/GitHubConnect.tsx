import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const GitHubConnect = () => {
  const { user, login } = useAuth();
  const { toast } = useToast();
  
  // Check if user logged in via GitHub OAuth
  const isGitHubUser = user?.prefs?.loginProvider === 'github';
  const githubUsername = user?.prefs?.githubUsername;

  const handleGitHubLogin = async () => {
    try {
      await login.withGitHub();
      toast({
        title: 'Success',
        description: 'Redirecting to GitHub for authentication...',
      });
    } catch (error) {
      console.error('Failed to connect GitHub:', error);
      toast({
        title: 'Error',
        description: 'Failed to connect GitHub account. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!user) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Github className="h-5 w-5" />
          GitHub Integration
        </CardTitle>
        <CardDescription>
          Connect with GitHub to streamline your repository workflow
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isGitHubUser ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900">GitHub Connected</p>
                {githubUsername ? (
                  <p className="text-sm text-green-700">Connected as @{githubUsername}</p>
                ) : (
                  <p className="text-sm text-green-700">Successfully authenticated with GitHub</p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://github.com', '_blank')}
                className="text-green-700 border-green-300 hover:bg-green-100"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Profile
              </Button>
            </div>
            
            <div className="text-sm text-slate-600">
              <p>✓ You can access public repositories</p>
              <p>✓ OAuth authentication active</p>
              <p>✓ Ready to generate CI/CD configurations</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">Enhanced GitHub Integration Available</p>
                <p className="text-sm text-blue-700">
                  Sign in with GitHub for the best experience
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                While you can manually enter repository URLs, signing in with GitHub provides:
              </p>
              <ul className="text-sm text-slate-600 space-y-1 ml-4">
                <li>• Faster repository access</li>
                <li>• Automatic repository detection</li>
                <li>• Enhanced security with OAuth</li>
                <li>• Seamless workflow integration</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleGitHubLogin} className="flex-1">
                <Github className="h-4 w-4 mr-2" />
                Sign in with GitHub
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.open('https://github.com', '_blank')}
                className="flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit GitHub
              </Button>
            </div>

            <p className="text-xs text-slate-500 text-center">
              Your current email login will remain active after connecting GitHub
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 