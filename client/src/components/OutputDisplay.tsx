import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, FileText, Settings, Play, Book, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DevPilotResponse } from '@/lib/api';
import { AppwriteAPI, SaveToAppwriteRequest } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface OutputDisplayProps {
  techStack: string;
  apiResponse: DevPilotResponse;
  repoUrl?: string;
}

export const OutputDisplay = ({ techStack, apiResponse, repoUrl }: OutputDisplayProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dockerfile');
  const [savingToAppwrite, setSavingToAppwrite] = useState<Record<string, boolean>>({});

  const copyToClipboard = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: `${type} has been copied to your clipboard.`,
    });
  };
  
  const saveToAppwrite = async (content: string, name: string, type: string) => {
    if (!user?.$id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save files to Appwrite.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSavingToAppwrite(prev => ({ ...prev, [type]: true }));
      
      const request: SaveToAppwriteRequest = {
        userId: user.$id,
        content,
        name,
        type,
        repoUrl
      };
      
      const response = await AppwriteAPI.saveToAppwrite(request);
      
      toast({
        title: "Saved to Appwrite",
        description: `${name} has been saved to your Appwrite storage.`,
      });
    } catch (error) {
      console.error('Failed to save to Appwrite:', error);
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Failed to save to Appwrite",
        variant: "destructive"
      });
    } finally {
      setSavingToAppwrite(prev => ({ ...prev, [type]: false }));
    }
  };

  const tabs = [
    {
      value: 'dockerfile',
      label: 'Dockerfile',
      icon: <Settings className="h-4 w-4" />,
      content: apiResponse.dockerfile,
      description: 'Production-ready Docker configuration',
      fileName: 'Dockerfile'
    },
    {
      value: 'github-actions',
      label: 'GitHub Actions',
      icon: <Play className="h-4 w-4" />,
      content: apiResponse.githubActions,
      description: 'Automated CI/CD workflow',
      fileName: '.github/workflows/ci.yml'
    },
    {
      value: 'env',
      label: '.env.example',
      icon: <FileText className="h-4 w-4" />,
      content: apiResponse.envExample,
      description: 'Environment variables template',
      fileName: '.env.example'
    },
    {
      value: 'docs',
      label: 'Documentation',
      icon: <Book className="h-4 w-4" />,
      content: apiResponse.docs,
      description: 'Deployment instructions and best practices',
      fileName: 'README.md'
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generated DevOps Configuration
        </CardTitle>
        <CardDescription>
          Production-ready files for your {techStack} project
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-1">
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{tab.label}</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(tab.content, tab.label)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const blob = new Blob([tab.content], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = tab.fileName;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => saveToAppwrite(tab.content, tab.fileName, tab.value)}
                      disabled={savingToAppwrite[tab.value]}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      {savingToAppwrite[tab.value] ? 'Saving...' : 'Save to Appwrite'}
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm text-slate-600">{tab.description}</p>
                
                <div className="relative">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{tab.content}</code>
                  </pre>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};