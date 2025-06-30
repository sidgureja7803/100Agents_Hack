import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bot, 
  GitBranch, 
  Sparkles, 
  AlertTriangle, 
  Info,
  Zap,
  Settings,
  Key
} from 'lucide-react';
import { AgentProgress } from './AgentProgress';
// import { AgentAPI, validateGitHubUrl } from '@/lib/agentApi';

interface AgentGenerationFormProps {
  onComplete?: (result: any) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const AgentGenerationForm: React.FC<AgentGenerationFormProps> = ({
  onComplete,
  onError,
  className
}) => {
  // Form state
  const [repoUrl, setRepoUrl] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [useAdvancedMode, setUseAdvancedMode] = useState(false);
  
  // Agent workflow state
  const [isRunning, setIsRunning] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'cloning' | 'cloned' | 'analyzing' | 'completed' | 'failed'>('cloning');
  const [messages, setMessages] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [techStack, setTechStack] = useState<any>(null);
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([]);
  
  // Form validation
  const [urlError, setUrlError] = useState('');
  const isValidUrl = repoUrl && validateGitHubUrl(repoUrl);

  // Validate GitHub URL
  function validateGitHubUrl(url: string): boolean {
    const githubUrlPattern = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+(?:\.git)?$/;
    return githubUrlPattern.test(url);
  }

  const handleUrlChange = (value: string) => {
    setRepoUrl(value);
    if (value && !validateGitHubUrl(value)) {
      setUrlError('Please enter a valid GitHub repository URL');
    } else {
      setUrlError('');
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

    try {
      // Mock implementation - replace with actual AgentAPI calls
      // Initialize socket connection
      // const socket = AgentAPI.initializeSocket(handleProgressUpdate);
      
      // Start the complete workflow
      // const result = await AgentAPI.runCompleteWorkflow(repoUrl, authToken, handleProgressUpdate);
      
      // Mock progress simulation for demo
      await simulateAgentWorkflow();
      
    } catch (error) {
      console.error('Agent workflow error:', error);
      setStatus('failed');
      setErrors([error instanceof Error ? error.message : 'Unknown error occurred']);
      if (onError) {
        onError(error instanceof Error ? error.message : 'Unknown error occurred');
      }
    } finally {
      setIsRunning(false);
    }
  };

  const handleProgressUpdate = (progressData: any) => {
    setSessionId(progressData.sessionId);
    setCurrentStep(progressData.step);
    setProgress(progressData.progress);
    setStatus(progressData.status);
    
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
  };

  // Mock simulation for demo purposes
  const simulateAgentWorkflow = async () => {
    const steps = [
      { step: 'Cloning repository...', progress: 25, status: 'cloning', delay: 2000 },
      { step: 'Planner Agent analyzing...', progress: 35, status: 'analyzing', delay: 3000 },
      { step: 'Analyzer Agent detecting tech stack...', progress: 55, status: 'analyzing', delay: 4000 },
      { step: 'Generator Agent creating CI/CD...', progress: 80, status: 'analyzing', delay: 3000 },
      { step: 'Verifier Agent validating...', progress: 95, status: 'analyzing', delay: 2000 },
      { step: 'Complete!', progress: 100, status: 'completed', delay: 1000 }
    ];

    for (const stepData of steps) {
      await new Promise(resolve => setTimeout(resolve, stepData.delay));
      setCurrentStep(stepData.step);
      setProgress(stepData.progress);
      setStatus(stepData.status as any);
      
      // Add mock messages
      if (stepData.progress === 35) {
        setMessages([{ agent: 'planner', message: 'Created comprehensive analysis plan', timestamp: new Date().toISOString() }]);
      } else if (stepData.progress === 55) {
        setTechStack({ primary: 'Node.js', frontend: ['React'], backend: ['Express'], languages: ['JavaScript', 'TypeScript'] });
        setMessages(prev => [...prev, { agent: 'analyzer', message: 'Detected tech stack: Node.js', timestamp: new Date().toISOString() }]);
      } else if (stepData.progress === 80) {
        setGeneratedFiles(['dockerfile', 'githubActions', 'envExample']);
        setMessages(prev => [...prev, { agent: 'generator', message: 'Generated all CI/CD configuration files', timestamp: new Date().toISOString() }]);
      } else if (stepData.progress === 100) {
        setMessages(prev => [...prev, { agent: 'verifier', message: 'Validation complete - all files verified', timestamp: new Date().toISOString() }]);
        if (onComplete) {
          onComplete({ techStack, generatedFiles, messages });
        }
      }
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setSessionId(null);
    setCurrentStep('');
    setProgress(0);
    setStatus('cloning');
    setMessages([]);
    setErrors([]);
    setTechStack(null);
    setGeneratedFiles([]);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Input Form */}
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
          {/* Repository URL Input */}
          <div className="space-y-2">
            <Label htmlFor="repo-url" className="flex items-center space-x-2">
              <GitBranch className="h-4 w-4" />
              <span>GitHub Repository URL</span>
            </Label>
            <Input
              id="repo-url"
              placeholder="https://github.com/username/repository"
              value={repoUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              disabled={isRunning}
              className={urlError ? 'border-red-300' : ''}
            />
            {urlError && (
              <p className="text-sm text-red-600">{urlError}</p>
            )}
            {isValidUrl && (
              <p className="text-sm text-green-600 flex items-center space-x-1">
                <span>✓</span>
                <span>Valid GitHub repository URL</span>
              </p>
            )}
          </div>

          {/* Advanced Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUseAdvancedMode(!useAdvancedMode)}
                disabled={isRunning}
              >
                <Settings className="h-4 w-4 mr-2" />
                {useAdvancedMode ? 'Hide' : 'Show'} Advanced Options
              </Button>
            </div>

            {useAdvancedMode && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
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
                    onChange={(e) => setAuthToken(e.target.value)}
                    disabled={isRunning}
                  />
                  <p className="text-xs text-gray-600">
                    Required only for private repositories. Generate at GitHub Settings → Developer settings → Personal access tokens
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* AI Agent Features */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200/60">
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-blue-100 rounded-full">
                <Sparkles className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-2">🤖 AI Agent Pipeline Features:</p>
                <ul className="text-blue-700 space-y-1">
                  <li>• <strong>Planner Agent:</strong> Analyzes repository structure and creates optimization plan</li>
                  <li>• <strong>Analyzer Agent:</strong> Detects tech stack, dependencies, and project patterns</li>
                  <li>• <strong>Generator Agent:</strong> Creates optimized Dockerfile, GitHub Actions, and .env files</li>
                  <li>• <strong>Verifier Agent:</strong> Validates configurations for security and best practices</li>
                  <li>• <strong>Real-time Progress:</strong> Live updates from each agent during analysis</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={handleStartAnalysis}
              disabled={!isValidUrl || isRunning}
              className="flex-1 h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isRunning ? (
                <>
                  <Zap className="mr-2 h-5 w-5 animate-pulse" />
                  AI Agents Running...
                </>
              ) : (
                <>
                  <Bot className="mr-2 h-5 w-5" />
                  Launch AI Agent Analysis
                </>
              )}
            </Button>

            {isRunning && (
              <Button
                variant="outline"
                onClick={handleReset}
                className="px-6"
              >
                Reset
              </Button>
            )}
          </div>

          {/* Info Alert */}
          {!isRunning && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                The AI agent system will clone your repository, analyze the codebase, and generate production-ready 
                CI/CD configurations tailored to your specific tech stack and project structure.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Progress Display */}
      {isRunning && (
        <AgentProgress
          sessionId={sessionId || undefined}
          currentStep={currentStep}
          progress={progress}
          status={status}
          messages={messages}
          errors={errors}
          techStack={techStack}
          generatedFiles={generatedFiles}
          onComplete={onComplete}
          onError={onError}
        />
      )}
    </div>
  );
}; 