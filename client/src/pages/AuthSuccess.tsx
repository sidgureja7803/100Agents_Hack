import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGitHub } from '../contexts/GitHubContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Github, CheckCircle, XCircle } from 'lucide-react';

const AuthSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setTokenFromCallback } = useGitHub();
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = React.useState<string>('');

  useEffect(() => {
    const token = searchParams.get('token');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setStatus('error');
      setError(getErrorMessage(errorParam));
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    if (token) {
      try {
        setTokenFromCallback(token);
        setStatus('success');
        setTimeout(() => navigate('/dashboard'), 2000);
      } catch (error) {
        setStatus('error');
        setError('Failed to process authentication token');
        setTimeout(() => navigate('/'), 3000);
      }
    } else {
      setStatus('error');
      setError('No authentication token received');
      setTimeout(() => navigate('/'), 3000);
    }
  }, [searchParams, setTokenFromCallback, navigate]);

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'invalid_state':
        return 'Invalid authentication state. Please try again.';
      case 'github_auth_failed':
        return 'GitHub authentication failed. Please try again.';
      default:
        return 'Authentication failed. Please try again.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Github className="h-6 w-6" />
            GitHub Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'loading' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Processing authentication...</p>
            </div>
          )}

          {status === 'success' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Success!</strong> Your GitHub account has been connected. 
                Redirecting to dashboard...
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Authentication Failed</strong><br />
                {error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthSuccess; 