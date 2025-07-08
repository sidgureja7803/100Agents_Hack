import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Bot, 
  GitBranch, 
  Sparkles, 
  AlertTriangle, 
  Info,
  Zap,
  Settings,
  Key,
  Play,
  AlertCircle,
  CheckCircle,
  Github
} from 'lucide-react';
import { AgentProgress } from './AgentProgress';

interface AgentGenerationFormProps {
  repoUrl?: string;
  authToken?: string;
  onComplete?: (result: any) => void;
  onError?: (error: string) => void;
  className?: string;
}

// Temporary AgentAPI service implementation
class AgentAPIService {
  initializeSocket(callback: (data: any) => void) {
    // Mock implementation for now
    console.log('Socket initialized');
  }
  
  async cloneRepository(params: { repoUrl: string; authToken?: string }) {
    // Mock implementation
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/clone-repo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return response.json();
  }
  
  async runAnalysis(params: { sessionId: string }) {
    // Mock implementation  
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return response.json();
  }
}

const validateGitHubUrl = (url: string) => {
  const githubUrlPattern = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+(?:\.git)?$/;
  return githubUrlPattern.test(url);
};

export const AgentGenerationForm: React.FC<AgentGenerationFormProps> = ({
  repoUrl: initialRepoUrl = '',
  authToken,
  onComplete,
  onError,
  className
}) => {
  // Form state
  const [repoUrl, setRepoUrl] = useState(initialRepoUrl);
  const [useAdvancedMode, setUseAdvancedMode] = useState(false);
  
  // Agent workflow state
  const [isRunning, setIsRunning] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState('Ready to analyze');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'cloning' | 'cloned' | 'analyzing' | 'completed' | 'failed'>('cloned');
  const [messages, setMessages] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [techStack, setTechStack] = useState<any>(null);
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([]);
  
  // Form validation
  const [urlError, setUrlError] = useState<string | null>(null);
  const isValidUrl = repoUrl && validateGitHubUrl(repoUrl);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setRepoUrl(url);
    
    if (url && !validateGitHubUrl(url)) {
      setUrlError('Please enter a valid GitHub repository URL (e.g., https://github.com/user/repo)');
    } else {
      setUrlError(null);
    }
  };

  const handleStartAnalysis = async () => {
    if (!isValidUrl) {
      setUrlError('Please enter a valid GitHub repository URL');
      return;
    }

    setIsRunning(true);
    setCurrentStep('Initializing AI agents...');
    setProgress(5);
    setStatus('cloning');
    setMessages([]);
    setErrors([]);
    setSessionId(null);

    try {
      const agentAPI = new AgentAPIService();
      
      // Initialize WebSocket connection for real-time updates
      agentAPI.initializeSocket(handleProgressUpdate);
      
      // Step 1: Clone repository
      setCurrentStep('Cloning repository...');
      setProgress(15);
      
      const cloneResult = await agentAPI.cloneRepository({
        repoUrl,
        authToken
      });
      
      if (!cloneResult.success) {
        throw new Error(cloneResult.error || 'Failed to clone repository');
      }
      
      setSessionId(cloneResult.sessionId);
      setCurrentStep('Repository cloned successfully');
      setProgress(25);
      setStatus('cloned');
      
      // Step 2: Start AI analysis
      setCurrentStep('Starting AI agent analysis...');
      setProgress(30);
      setStatus('analyzing');
      
      const analysisResult = await agentAPI.runAnalysis({
        sessionId: cloneResult.sessionId
      });
      
      if (!analysisResult.success) {
        throw new Error(analysisResult.error || 'Analysis failed');
      }
      
      // Analysis will continue via WebSocket updates
      
    } catch (error) {
      console.error('Agent workflow error:', error);
      setStatus('failed');
      setErrors([error instanceof Error ? error.message : 'Unknown error occurred']);
      setCurrentStep('Analysis failed');
      setProgress(0);
      
      if (onError) {
        onError(error instanceof Error ? error.message : 'Unknown error occurred');
      }
    } finally {
      setIsRunning(false);
    }
  };

  const handleProgressUpdate = (progressData: any) => {
    console.log('Progress update:', progressData);
    
    if (progressData.sessionId && !sessionId) {
      setSessionId(progressData.sessionId);
    }
    
    if (progressData.step) {
      setCurrentStep(progressData.step);
    }
    
    if (progressData.progress !== undefined) {
      setProgress(progressData.progress);
    }
    
    if (progressData.status) {
      setStatus(progressData.status);
    }
    
    if (progressData.messages) {
      setMessages(progressData.messages);
    }
    
    if (progressData.errors) {
      setErrors(progressData.errors);
    }
    
    if (progressData.techStack) {
      setTechStack(progressData.techStack);
    }
    
    if (progressData.generatedFiles) {
      setGeneratedFiles(progressData.generatedFiles);
    }
    
    // Handle completion
    if (progressData.status === 'completed' && onComplete) {
      onComplete({
        sessionId: progressData.sessionId,
        techStack: progressData.techStack,
        generatedFiles: progressData.generatedFiles,
        messages: progressData.messages
      });
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setSessionId(null);
    setCurrentStep('Ready to analyze');
    setProgress(0);
    setStatus('cloned');
    setMessages([]);
    setErrors([]);
    setTechStack(null);
    setGeneratedFiles([]);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="shadow-lg border-slate-200/60">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
              <Bot className="h-5 w-5 text-blue-600" />
            </div>
            <span>AI Agent DevOps Generator</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Multi-Agent System
            </Badge>
          </CardTitle>
          <CardDescription>
            Enter your GitHub repository URL to let our AI agents analyze and generate production-ready CI/CD configurations
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs defaultValue="setup" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="setup">Repository Setup</TabsTrigger>
              <TabsTrigger value="progress">Analysis Progress</TabsTrigger>
            </TabsList>
            
            <TabsContent value="setup" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="repo-url" className="flex items-center space-x-2">
                    <GitBranch className="h-4 w-4" />
                    <span>GitHub Repository URL</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="repo-url"
                      placeholder="https://github.com/username/repository"
                      value={repoUrl}
                      onChange={handleUrlChange}
                      disabled={isRunning}
                      className={urlError ? 'border-red-300 pr-10' : isValidUrl ? 'border-green-300 pr-10' : ''}
                    />
                    {isValidUrl && (
                      <CheckCircle className="absolute right-3 top-2.5 h-4 w-4 text-green-600" />
                    )}
                    {urlError && (
                      <AlertCircle className="absolute right-3 top-2.5 h-4 w-4 text-red-600" />
                    )}
                  </div>
                  {urlError && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{urlError}</AlertDescription>
                    </Alert>
                  )}
                  {isValidUrl && (
                    <Alert className="mt-2 border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Valid GitHub repository URL detected
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUseAdvancedMode(!useAdvancedMode)}
                      disabled={isRunning}
                      className="transition-all duration-200 hover:bg-gray-50"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      {useAdvancedMode ? 'Hide' : 'Show'} Advanced Options
                    </Button>
                    <Badge variant="secondary" className="text-xs">
                      For Private Repos
                    </Badge>
                  </div>

                  {useAdvancedMode && (
                    <div className="space-y-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-blue-200 animate-in slide-in-from-top duration-300">
                      <div className="space-y-2">
                        <Label htmlFor="auth-token" className="flex items-center space-x-2">
                          <Key className="h-4 w-4" />
                          <span>GitHub Personal Access Token</span>
                          <Badge variant="outline" className="text-xs">Optional</Badge>
                        </Label>
                        <Input
                          id="auth-token"
                          type="password"
                          placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          value={authToken}
                          onChange={(e) => {
                            // Handle auth token change
                          }}
                          disabled={isRunning}
                          className="font-mono text-sm"
                        />
                        <Alert className="mt-2">
                          <Info className="h-4 w-4" />
                          <AlertDescription className="text-sm">
                            Required only for private repositories. Generate at{' '}
                            <a 
                              href="https://github.com/settings/tokens" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              GitHub Settings → Developer settings → Personal access tokens
                            </a>
                          </AlertDescription>
                        </Alert>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Zap className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-purple-900">AI-Powered Analysis</h3>
                      <p className="text-sm text-purple-700">
                        Multi-agent system analyzes your repository
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Github className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-green-900">Production Ready</h3>
                      <p className="text-sm text-green-700">
                        Generates optimized CI/CD configurations
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleStartAnalysis}
                  disabled={!isValidUrl || isRunning}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 transition-all duration-200 transform hover:scale-105"
                  size="lg"
                >
                  {isRunning ? (
                    <>
                      <Bot className="mr-2 h-5 w-5 animate-pulse" />
                      Running Analysis...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Start AI Analysis
                    </>
                  )}
                </Button>

                {!isValidUrl && repoUrl && (
                  <p className="text-sm text-gray-500 text-center">
                    Please enter a valid GitHub repository URL to continue
                  </p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="progress" className="space-y-4">
              <AgentProgress
                sessionId={sessionId}
                currentStep={currentStep}
                progress={progress}
                status={status}
                messages={messages}
                errors={errors}
                techStack={techStack}
                generatedFiles={generatedFiles}
                onComplete={onComplete}
                onError={onError}
                onProgressUpdate={handleProgressUpdate}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}; 