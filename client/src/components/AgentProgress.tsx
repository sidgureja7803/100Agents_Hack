import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Bot, 
  GitBranch,
  Search,
  Cog,
  Shield,
  Download,
  ExternalLink,
  Loader2
} from 'lucide-react';

interface AgentMessage {
  agent: string;
  message: string;
  timestamp: string;
}

interface AgentProgressProps {
  sessionId?: string;
  currentStep: string;
  progress: number;
  status: 'cloning' | 'cloned' | 'analyzing' | 'completed' | 'failed';
  messages?: AgentMessage[];
  errors?: string[];
  techStack?: any;
  generatedFiles?: string[];
  onComplete?: (result: any) => void;
  onError?: (error: string) => void;
}

const WORKFLOW_STEPS = [
  {
    id: 'clone',
    title: 'Clone Repository',
    description: 'Downloading repository from GitHub',
    icon: GitBranch,
    estimatedTime: '10-30s'
  },
  {
    id: 'plan',
    title: 'AI Planning',
    description: 'Planner Agent analyzing project structure',
    icon: Bot,
    estimatedTime: '15-45s'
  },
  {
    id: 'analyze',
    title: 'Codebase Analysis',
    description: 'Analyzer Agent detecting tech stack',
    icon: Search,
    estimatedTime: '30-60s'
  },
  {
    id: 'generate',
    title: 'Generate CI/CD',
    description: 'Generator Agent creating configurations',
    icon: Cog,
    estimatedTime: '45-90s'
  },
  {
    id: 'verify',
    title: 'Verification',
    description: 'Verifier Agent validating outputs',
    icon: Shield,
    estimatedTime: '15-30s'
  }
];

export const AgentProgress: React.FC<AgentProgressProps> = ({
  sessionId,
  currentStep,
  progress,
  status,
  messages = [],
  errors = [],
  techStack,
  generatedFiles = [],
  onComplete,
  onError
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Update current step index based on progress
    if (progress <= 25) setCurrentStepIndex(0);
    else if (progress <= 35) setCurrentStepIndex(1);
    else if (progress <= 65) setCurrentStepIndex(2);
    else if (progress <= 90) setCurrentStepIndex(3);
    else setCurrentStepIndex(4);
  }, [progress]);

  useEffect(() => {
    if (status === 'completed' && onComplete) {
      onComplete({ techStack, generatedFiles, messages });
    } else if (status === 'failed' && onError && errors.length > 0) {
      onError(errors[0]);
    }
  }, [status, onComplete, onError, techStack, generatedFiles, messages, errors]);

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'pending';
  };

  const getStatusIcon = (stepStatus: string) => {
    switch (stepStatus) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'current':
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStepColor = (stepStatus: string) => {
    switch (stepStatus) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'current':
        return 'border-blue-200 bg-blue-50';
      case 'pending':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-blue-600" />
              <span>AI DevOps Agent Pipeline</span>
              {sessionId && (
                <Badge variant="outline" className="text-xs">
                  Session: {sessionId.substring(0, 8)}...
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Multi-agent system analyzing your repository and generating CI/CD configurations
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{currentStep}</span>
            <span className="text-gray-500">{progress}% Complete</span>
          </div>
          <Progress 
            value={progress} 
            className={`h-2 ${status === 'failed' ? 'bg-red-100' : 'bg-blue-100'}`}
          />
        </div>

        {/* Workflow Steps */}
        <div className="space-y-4">
          {WORKFLOW_STEPS.map((step, index) => {
            const stepStatus = getStepStatus(index);
            const Icon = step.icon;
            
            return (
              <div
                key={step.id}
                className={`flex items-center space-x-4 p-4 rounded-lg border ${getStepColor(stepStatus)} transition-all duration-200`}
              >
                <div className="flex-shrink-0">
                  {getStatusIcon(stepStatus)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4 text-gray-600" />
                    <h3 className="font-medium text-gray-900">{step.title}</h3>
                    <Badge 
                      variant={stepStatus === 'completed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {stepStatus === 'completed' ? 'Done' : 
                       stepStatus === 'current' ? 'Running' : 'Pending'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Est. time: {step.estimatedTime}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Error Display */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <h3 className="font-medium text-red-900">Errors Detected</h3>
            </div>
            <div className="space-y-1">
              {errors.map((error, index) => (
                <p key={index} className="text-sm text-red-700">{error}</p>
              ))}
            </div>
          </div>
        )}

        {/* Agent Messages */}
        {showDetails && messages.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900 flex items-center space-x-2">
              <Bot className="h-4 w-4" />
              <span>Agent Activity Log</span>
            </h3>
            <ScrollArea className="h-48 w-full border rounded-lg p-3">
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Badge variant="outline" className="text-xs">
                      {message.agent}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{message.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Tech Stack Detection */}
        {techStack && showDetails && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">🔍 Detected Tech Stack</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium">Primary:</span> {techStack.primary}
              </div>
              {techStack.frontend?.length > 0 && (
                <div>
                  <span className="font-medium">Frontend:</span> {techStack.frontend.join(', ')}
                </div>
              )}
              {techStack.backend?.length > 0 && (
                <div>
                  <span className="font-medium">Backend:</span> {techStack.backend.join(', ')}
                </div>
              )}
              {techStack.languages?.length > 0 && (
                <div>
                  <span className="font-medium">Languages:</span> {techStack.languages.join(', ')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Generated Files */}
        {generatedFiles.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2 flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Generated Files</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {generatedFiles.map((file, index) => (
                <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                  {file}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Status Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center space-x-2">
            <div 
              className={`w-3 h-3 rounded-full ${
                status === 'completed' ? 'bg-green-500' :
                status === 'failed' ? 'bg-red-500' :
                'bg-blue-500 animate-pulse'
              }`}
            />
            <span className="text-sm font-medium capitalize">{status}</span>
          </div>
          
          {status === 'completed' && (
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Files
              </Button>
              <Button size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Results
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 