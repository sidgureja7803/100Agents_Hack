import React, { Component, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, Bug, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
  errorId: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: this.generateErrorId()
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: Date.now().toString(36)
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo: errorInfo.componentStack
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error);
      console.error('Error Info:', errorInfo);
    }

    // Send error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  generateErrorId(): string {
    return `error_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async logErrorToService(error: Error, errorInfo: React.ErrorInfo) {
    try {
      // Send error to your monitoring service
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          errorId: this.state.errorId,
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      });
    } catch (logError) {
      console.error('Failed to log error to service:', logError);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: this.generateErrorId()
    });
  };

  handleReportError = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify({
        errorId: this.state.errorId,
        message: this.state.error?.message,
        stack: this.state.error?.stack,
        timestamp: new Date().toISOString()
      }, null, 2));
      
      alert('Error details copied to clipboard. Please report this to our support team.');
    } catch (err) {
      console.error('Failed to copy error details:', err);
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="h-6 w-6" />
                <span>Something went wrong</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert variant="destructive">
                <Bug className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">
                      {this.state.error?.message || 'An unexpected error occurred'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Error ID: <code className="bg-gray-100 px-1 rounded">{this.state.errorId}</code>
                    </p>
                  </div>
                </AlertDescription>
              </Alert>

              {process.env.NODE_ENV === 'development' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm mb-2">Error Details:</h3>
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                      {this.state.error?.stack}
                    </pre>
                  </div>
                  
                  {this.state.errorInfo && (
                    <div>
                      <h3 className="font-medium text-sm mb-2">Component Stack:</h3>
                      <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                        {this.state.errorInfo}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              <div className="flex space-x-3">
                <Button onClick={this.handleRetry} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={this.handleReportError}
                  className="flex-1"
                >
                  <Bug className="h-4 w-4 mr-2" />
                  Report Error
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/'}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  If this problem persists, please contact our support team with the error ID above.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easy wrapping
export function withErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: T) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Hook for handling async errors
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((error: Error) => {
    setError(error);
    // This will be caught by the nearest error boundary
    throw error;
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
}
