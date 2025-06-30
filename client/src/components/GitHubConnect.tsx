import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Link2Off } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';

export const GitHubConnect = () => {
  const { user } = useUser();
  const { toast } = useToast();
  
  const githubOAuth = user?.externalAccounts.find(
    account => account.provider === 'github'
  );

  const handleConnect = async () => {
    try {
      await user?.createExternalAccount({
        strategy: "oauth_github",
        redirect_url: "/select-repo",
      });
    } catch (error) {
      console.error('Failed to connect GitHub:', error);
      toast({
        title: 'Error',
        description: 'Failed to connect GitHub account',
        variant: 'destructive',
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      if (githubOAuth) {
        await githubOAuth.destroy();
        toast({
          title: 'Success',
          description: 'GitHub account disconnected successfully',
        });
      }
    } catch (error) {
      console.error('Failed to disconnect GitHub:', error);
      toast({
        title: 'Error',
        description: 'Failed to disconnect GitHub account',
        variant: 'destructive',
      });
    }
  };

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Github className="h-5 w-5" />
          GitHub Connection
        </CardTitle>
        <CardDescription>
          Connect your GitHub account to access your repositories
        </CardDescription>
      </CardHeader>
      <CardContent>
        {githubOAuth ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">Connected as</p>
                <p className="text-sm text-slate-500">{githubOAuth.username}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Link2Off className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Connect your GitHub account to automatically import repositories and set up CI/CD pipelines.
            </p>
            <Button onClick={handleConnect} className="w-full sm:w-auto">
              <Github className="h-4 w-4 mr-2" />
              Connect GitHub Account
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 