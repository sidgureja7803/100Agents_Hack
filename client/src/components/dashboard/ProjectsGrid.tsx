import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProjectCard } from './ProjectCard';
import { 
  Search, 
  Filter, 
  FolderOpen, 
  Plus,
  SortAsc,
  SortDesc
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

interface ProjectsGridProps {
  projects: Project[];
  onCreateNew: () => void;
  onDownload?: (projectId: string) => void;
  onShare?: (projectId: string) => void;
  onDelete?: (projectId: string) => void;
  onRedeploy?: (projectId: string) => void;
  onConfigure?: (projectId: string) => void;
  className?: string;
}

type SortField = 'name' | 'createdAt' | 'lastGenerated' | 'status' | 'deploymentCount';
type SortDirection = 'asc' | 'desc';

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({
  projects,
  onCreateNew,
  onDownload,
  onShare,
  onDelete,
  onRedeploy,
  onConfigure,
  className
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.techStack.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.repoUrl.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
      return matchesSearch && matchesFilter;
    });

    // Sort projects
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'createdAt' || sortField === 'lastGenerated') {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      } else if (sortField === 'deploymentCount') {
        aValue = aValue || 0;
        bValue = bValue || 0;
      } else {
        aValue = aValue?.toLowerCase() || '';
        bValue = bValue?.toLowerCase() || '';
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [projects, searchTerm, filterStatus, sortField, sortDirection]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const statusCounts = {
    all: projects.length,
    completed: projects.filter(p => p.status === 'completed').length,
    generating: projects.filter(p => p.status === 'generating').length,
    failed: projects.filter(p => p.status === 'failed').length
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">My Projects</h2>
          <p className="text-slate-600">Manage your CI/CD configurations and deployments</p>
        </div>
        
        <Button 
          onClick={onCreateNew}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-slate-600" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Status ({statusCounts.all})</option>
            <option value="completed">Completed ({statusCounts.completed})</option>
            <option value="generating">Generating ({statusCounts.generating})</option>
            <option value="failed">Failed ({statusCounts.failed})</option>
          </select>
        </div>
        
        {/* Sort Options */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleSort('createdAt')}
            className={sortField === 'createdAt' ? 'bg-purple-50 border-purple-200' : ''}
          >
            Date
            {sortField === 'createdAt' && (
              sortDirection === 'asc' ? <SortAsc className="h-3 w-3 ml-1" /> : <SortDesc className="h-3 w-3 ml-1" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleSort('name')}
            className={sortField === 'name' ? 'bg-purple-50 border-purple-200' : ''}
          >
            Name
            {sortField === 'name' && (
              sortDirection === 'asc' ? <SortAsc className="h-3 w-3 ml-1" /> : <SortDesc className="h-3 w-3 ml-1" />
            )}
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredAndSortedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDownload={onDownload}
              onShare={onShare}
              onDelete={onDelete}
              onRedeploy={onRedeploy}
              onConfigure={onConfigure}
            />
          ))}
        </div>
      ) : (
        <Card className="border-slate-200/60">
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                <FolderOpen className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">No projects found</h3>
                <p className="text-slate-600">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Create your first CI/CD setup to get started'
                  }
                </p>
              </div>
              {!searchTerm && filterStatus === 'all' && (
                <Button 
                  onClick={onCreateNew}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Your First Setup
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 