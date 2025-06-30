import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Link2Off } from 'lucide-react';
import { GitHubAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const GitHubConnect = () => {
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState<string>();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkGitHubStatus = async () => {
      try {
        const status = await GitHubAPI.getGitHubAccountStatus();
        setConnected(status.connected);
        setUsername(status.username);
      } catch (error) {
        console.error('Failed to check GitHub status:', error);
        toast({
          title: 'Error',
          description: 'Failed to check GitHub connection status',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    checkGitHubStatus();
  }, [toast]);

  const handleConnect = async () => {
    try {
      await GitHubAPI.connectGitHubAccount();
      // The actual connection will be handled by OAuth redirect
      window.location.href = `${import.meta.env.VITE_APPWRITE_FUNCTION_URL}/github/oauth`;
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
      await GitHubAPI.disconnectGitHubAccount();
      setConnected(false);
      setUsername(undefined);
      toast({
        title: 'Success',
        description: 'GitHub account disconnected successfully',
      });
    } catch (error) {
      console.error('Failed to disconnect GitHub:', error);
      toast({
        title: 'Error',
        description: 'Failed to disconnect GitHub account',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-200 h-10 w-10"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
        {connected ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">Connected as</p>
                <p className="text-sm text-slate-500">{username}</p>
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