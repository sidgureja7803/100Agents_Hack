import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { StatsOverview, defaultStats } from '@/components/dashboard/StatsOverview';
import { GenerationForm } from '@/components/dashboard/GenerationForm';
import { ProjectsGrid } from '@/components/dashboard/ProjectsGrid';
import { OutputDisplay } from '@/components/OutputDisplay';
import { ChatPanel } from '@/components/ChatPanel';
import { useAuth } from '@/contexts/AuthContext';
import { DevPilotAPI, DevPilotResponse } from '@/lib/api';
import { 
  BarChart3, 
  Target, 
  Shield, 
  Zap, 
  Globe,
  FolderOpen, 
  CheckCircle, 
  Clock
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  repoUrl: string;
  techStack: string;
  status: 'generating' | 'completed' | 'failed';
  createdAt: string;
  lastGenerated?: string;
  deploymentCount?: number;
}

export const EnhancedDashboard = () => {
  const { user } = useAuth();
  
  // Form state
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [apiResponse, setApiResponse] = useState<DevPilotResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Dashboard state
  const [activeTab, setActiveTab] = useState('generate');
  const [projects, setProjects] = useState<Project[]>([]);

  // Load projects on mount
  useEffect(() => {
    // Mock data for demonstration
    setProjects([
      {
        id: '1',
        name: 'E-commerce API',
        repoUrl: 'https://github.com/user/ecommerce-api',
        techStack: 'Node.js + PostgreSQL',
        status: 'completed',
        createdAt: '2024-01-15',
        lastGenerated: '2024-01-20',
        deploymentCount: 5
      },
      {
        id: '2',
        name: 'React Dashboard',
        repoUrl: 'https://github.com/user/react-dashboard',
        techStack: 'React + TypeScript',
        status: 'completed',
        createdAt: '2024-01-10',
        lastGenerated: '2024-01-18',
        deploymentCount: 3
      },
      {
        id: '3',
        name: 'ML Pipeline',
        repoUrl: 'https://github.com/user/ml-pipeline',
        techStack: 'Python + Docker',
        status: 'generating',
        createdAt: '2024-01-22'
      }
    ]);
  }, []);

  const handleGenerate = async (repoUrl: string, techStack: string) => {
    if (!user) return;
    
    setIsGenerating(true);
    setShowOutput(false);
    setShowChat(false);
    setError(null);
    
    try {
      const response = await DevPilotAPI.generateCICD(repoUrl, techStack, user.$id);
      setApiResponse(response);
      setShowOutput(true);
      setShowChat(true);
      
      // Add to projects list
      const newProject: Project = {
        id: Date.now().toString(),
        name: repoUrl.split('/').pop() || 'Unknown Project',
        repoUrl,
        techStack,
        status: 'completed',
        createdAt: new Date().toISOString().split('T')[0],
        lastGenerated: new Date().toISOString().split('T')[0],
        deploymentCount: 1
      };
      
      setProjects(prev => [newProject, ...prev]);
    } catch (err) {
      console.error('Generation failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate CI/CD setup. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Calculate dynamic stats
  const stats = [
    {
      ...defaultStats[0],
      value: projects.length,
    },
    {
      ...defaultStats[1],
      value: projects.filter(p => p.status === 'completed').length,
    },
    {
      ...defaultStats[2],
      value: projects.length * 8,
    },
    {
      ...defaultStats[3],
      value: projects.filter(p => p.status === 'generating').length,
    }
  ];

  const handleProjectAction = (action: string, projectId: string) => {
    console.log(`${action} project:`, projectId);
    // Implement project actions
  };

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8">
        {/* Stats Overview */}
        <StatsOverview stats={stats} />

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate">Generate CI/CD</TabsTrigger>
            <TabsTrigger value="projects">My Projects</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Generate Tab */}
          <TabsContent value="generate" className="space-y-8">
            <GenerationForm
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              error={error}
            />

            {/* Output Section */}
            {showOutput && apiResponse && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                <div className="lg:col-span-2">
                  <OutputDisplay 
                    techStack="Generated Tech Stack"
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
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <ProjectsGrid
              projects={projects}
              onCreateNew={() => setActiveTab('generate')}
              onDownload={(id) => handleProjectAction('download', id)}
              onShare={(id) => handleProjectAction('share', id)}
              onDelete={(id) => handleProjectAction('delete', id)}
              onRedeploy={(id) => handleProjectAction('redeploy', id)}
              onConfigure={(id) => handleProjectAction('configure', id)}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Analytics & Insights</h2>
              <p className="text-slate-600">Track your DevOps automation performance</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Usage Overview */}
              <Card className="border-slate-200/60">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Usage Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Projects Generated</span>
                      <span className="text-sm text-slate-600">{projects.length}/50</span>
                    </div>
                    <Progress value={(projects.length / 50) * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Storage Used</span>
                      <span className="text-sm text-slate-600">2.3GB/10GB</span>
                    </div>
                    <Progress value={23} className="h-2" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">API Calls</span>
                      <span className="text-sm text-slate-600">847/1000</span>
                    </div>
                    <Progress value={84.7} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Tech Stack Distribution */}
              <Card className="border-slate-200/60">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Tech Stack Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Node.js + PostgreSQL', count: 5, percentage: 45 },
                      { name: 'React + TypeScript', count: 3, percentage: 27 },
                      { name: 'Python + Docker', count: 2, percentage: 18 },
                      { name: 'Other', count: 1, percentage: 10 }
                    ].map((tech, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{tech.name}</span>
                          <span className="text-sm text-slate-600">{tech.count} projects</span>
                        </div>
                        <Progress value={tech.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-slate-200/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Security Score</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">98%</div>
                  <p className="text-sm text-slate-600">All configs pass security checks</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span>Avg. Generation Time</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">42s</div>
                  <p className="text-sm text-slate-600">From request to ready</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-purple-600" />
                    <span>Deployment Success</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">99.2%</div>
                  <p className="text-sm text-slate-600">First-time deployment success rate</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}; 