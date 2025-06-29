import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HeroSection } from '@/components/HeroSection';
import { RepositoryInput } from '@/components/RepositoryInput';
import { TechStackSelector } from '@/components/TechStackSelector';
import { OutputDisplay } from '@/components/OutputDisplay';
import { ChatPanel } from '@/components/ChatPanel';
import { Footer } from '@/components/Footer';
import { LoginModal } from '@/components/LoginModal';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Lock, ArrowRight } from 'lucide-react';
import { DevPilotAPI, DevPilotResponse } from '@/lib/api';

const Index = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [techStack, setTechStack] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [apiResponse, setApiResponse] = useState<DevPilotResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleGenerate = async () => {
    if (!repoUrl || !techStack) return;
    
    setIsGenerating(true);
    setShowOutput(false);
    setShowChat(false);
    setError(null);
    
    try {
      // Call the real API
      const response = await DevPilotAPI.generateCICD(repoUrl, techStack);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Login Button */}
        <div className="flex justify-end mb-8">
          <Button 
            onClick={() => setShowLoginModal(true)}
            variant="outline"
            className="border-blue-200 hover:bg-blue-50"
          >
            Sign In / Sign Up
          </Button>
        </div>

        <HeroSection />
        
        <div className="max-w-4xl mx-auto mt-16 space-y-8">
          {/* Demo Notice */}
          <Card className="bg-blue-50 border-blue-200/60">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-3">
                <Lock className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">Try DevPilotAI Demo</h3>
                  <p className="text-sm text-blue-700">
                    Experience our AI-powered DevOps generation. Sign up for full features and project history.
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => setShowLoginModal(true)}
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
                ) : (
                  'Generate CI/CD Setup'
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-slate-500">
                  Want to save your configurations? 
                  <Button 
                    variant="link" 
                    className="p-0 ml-1 h-auto text-blue-600 hover:text-blue-700"
                    onClick={() => setShowLoginModal(true)}
                  >
                    Sign up for free
                  </Button>
                </p>
              </div>
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
      
      <Footer />
      
      {/* Login Modal */}
      <LoginModal 
        open={showLoginModal} 
        onOpenChange={setShowLoginModal} 
      />
    </div>
  );
};

export default Index;