import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RepositoryInput } from '@/components/RepositoryInput';
import { TechStackSelector } from '@/components/TechStackSelector';
import { OutputDisplay } from '@/components/OutputDisplay';
import { ChatPanel } from '@/components/ChatPanel';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  AlertCircle, 
  ArrowLeft, 
  Lock, 
  ArrowRight,
  Rocket,
  Sparkles,
  Users,
  Zap
} from 'lucide-react';
import { DevPilotAPI, DevPilotResponse } from '@/lib/api';

export const Demo = () => {
  const navigate = useNavigate();
  
  const [repoUrl, setRepoUrl] = useState('');
  const [techStack, setTechStack] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [apiResponse, setApiResponse] = useState<DevPilotResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generationCount, setGenerationCount] = useState(0);

  const maxDemoGenerations = 3;

  const handleGenerate = async () => {
    if (!repoUrl || !techStack) return;
    
    if (generationCount >= maxDemoGenerations) {
      navigate('/auth');
      return;
    }
    
    setIsGenerating(true);
    setShowOutput(false);
    setShowChat(false);
    setError(null);
    
    try {
      const response = await DevPilotAPI.generateCICD(repoUrl, techStack);
      setApiResponse(response);
      setShowOutput(true);
      setShowChat(true);
      setGenerationCount(prev => prev + 1);
    } catch (err) {
      console.error('Generation failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate CI/CD setup. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const remainingGenerations = maxDemoGenerations - generationCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Rocket className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">DevPilotAI</span>
            </div>
            
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Demo Mode
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-4 py-2 border border-purple-200/60">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-purple-700 font-medium text-sm">FREE DEMO</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Try DevPilotAI
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {" "}Free Demo
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Experience our AI-powered DevOps generation with up to {maxDemoGenerations} free attempts. 
              No signup required!
            </p>
            
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-2 text-slate-600">
                <Users className="h-5 w-5 text-green-600" />
                <span className="text-sm">12K+ developers</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="text-sm">500K+ hours saved</span>
              </div>
            </div>
          </div>

          {/* Demo Limitations Notice */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/60">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-3">
                <Lock className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">Demo Limitations</h3>
                  <p className="text-sm text-blue-700">
                    {remainingGenerations > 0 
                      ? `${remainingGenerations} generation${remainingGenerations !== 1 ? 's' : ''} remaining. Sign up for unlimited access and project history.`
                      : 'Demo limit reached. Sign up to continue generating CI/CD configurations.'
                    }
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Get Full Access
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Input Section */}
          <Card className="shadow-lg border border-slate-200/60">
            <CardHeader>
              <CardTitle>Generate CI/CD Setup</CardTitle>
              <CardDescription>
                Enter a GitHub repository URL and select your tech stack to see our AI in action
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
                ) : remainingGenerations > 0 ? (
                  <>
                    Generate CI/CD Setup
                    <span className="ml-2 text-sm opacity-75">
                      ({remainingGenerations} left)
                    </span>
                  </>
                ) : (
                  'Sign Up to Continue'
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-slate-500">
                  Want to save your configurations and get unlimited generations? 
                  <Button 
                    variant="link" 
                    className="p-0 ml-1 h-auto text-blue-600 hover:text-blue-700"
                    onClick={() => navigate('/auth')}
                  >
                    Sign up for free
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          {showOutput && apiResponse && (
            <div className="space-y-6">
              {/* Upgrade Prompt */}
              {generationCount >= maxDemoGenerations && (
                <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200/60">
                  <CardContent className="text-center p-6">
                    <div className="space-y-4">
                      <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-4 py-2">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                        <span className="text-purple-700 font-medium text-sm">DEMO COMPLETE</span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-slate-900">
                        Ready for More?
                      </h3>
                      <p className="text-slate-600 max-w-md mx-auto">
                        You've reached the demo limit. Sign up for free to get unlimited generations, 
                        project history, and advanced features.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button 
                          onClick={() => navigate('/auth')}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          Sign Up Free
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setRepoUrl('');
                            setTechStack('');
                            setShowOutput(false);
                            setShowChat(false);
                            setApiResponse(null);
                          }}
                        >
                          Try Another Repository
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 