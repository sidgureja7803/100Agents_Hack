import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppwriteAPI, SavedFile } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Trash2, RefreshCw, FilePlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export const SavedFiles: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [files, setFiles] = useState<SavedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedFiles = async () => {
    if (!user?.$id) return;

    setLoading(true);
    setError(null);

    try {
      const savedFiles = await AppwriteAPI.getSavedFiles(user.$id);
      setFiles(savedFiles);
    } catch (err) {
      console.error('Error fetching saved files:', err);
      setError('Failed to fetch your saved files');
      toast({
        title: 'Error',
        description: 'Failed to fetch your saved files',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSavedFiles();
    }
  }, [user]);

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      const downloadUrl = await AppwriteAPI.getFileDownloadUrl(fileId);
      
      // Create a temporary link and trigger download
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      a.click();
    } catch (err) {
      console.error('Error downloading file:', err);
      toast({
        title: 'Download Failed',
        description: 'Failed to download the file',
        variant: 'destructive',
      });
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'dockerfile':
        return 'bg-blue-100 text-blue-800';
      case 'github-actions':
        return 'bg-purple-100 text-purple-800';
      case 'env':
        return 'bg-green-100 text-green-800';
      case 'docs':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getFileTypeLabel = (type: string) => {
    switch (type) {
      case 'dockerfile':
        return 'Dockerfile';
      case 'github-actions':
        return 'GitHub Actions';
      case 'env':
        return 'Env File';
      case 'docs':
        return 'Documentation';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Files</CardTitle>
          <CardDescription>Please sign in to view your saved files</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Saved Files</CardTitle>
          <CardDescription>Your files stored in Appwrite</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={fetchSavedFiles} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 text-red-800 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {files.length === 0 && !loading ? (
          <div className="text-center py-8 space-y-4">
            <FilePlus className="h-12 w-12 mx-auto text-slate-300" />
            <p className="text-slate-600">No saved files found</p>
            <p className="text-slate-400 text-sm">
              Generated files can be saved using the "Save to Appwrite" button
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {files.map((file) => (
              <div
                key={file.$id}
                className="border rounded-lg p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{file.name}</h3>
                    <Badge className={getFileTypeColor(file.type)}>
                      {getFileTypeLabel(file.type)}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">
                    Created: {formatDate(file.createdAt)}
                  </p>
                  {file.repoUrl && (
                    <p className="text-xs text-slate-500 truncate max-w-md">
                      Repo: {file.repoUrl}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(file.fileId, file.name)}
                  >
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 