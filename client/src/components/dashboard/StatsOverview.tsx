import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FolderOpen, 
  CheckCircle, 
  Clock, 
  Zap, 
  TrendingUp,
  Users,
  Shield,
  Globe
} from 'lucide-react';
import { ProjectsAPI, AnalyticsAPI } from '@/lib/api';

interface StatItem {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface StatsOverviewProps {
  className?: string;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ className }) => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projects, analytics] = await Promise.all([
          ProjectsAPI.getProjects(),
          AnalyticsAPI.getOverallAnalytics()
        ]);

        const totalProjects = projects.length;
        const successfulDeployments = analytics.projects.reduce((acc, curr) => acc + curr.deployments, 0);
        const averageSuccessRate = analytics.projects.reduce((acc, curr) => acc + curr.successRate, 0) / analytics.projects.length;
        const totalBuildTime = analytics.projects.reduce((acc, curr) => acc + curr.buildTime, 0);
        const hoursSaved = Math.round(totalBuildTime / 3600); // Convert seconds to hours

        setStats([
          {
            label: 'Total Projects',
            value: totalProjects,
            icon: <FolderOpen className="h-5 w-5" />,
            color: 'text-blue-600'
          },
          {
            label: 'Successful Deployments',
            value: successfulDeployments,
            icon: <CheckCircle className="h-5 w-5" />,
            color: 'text-green-600'
          },
          {
            label: 'Hours Saved',
            value: hoursSaved,
            icon: <Clock className="h-5 w-5" />,
            color: 'text-purple-600'
          },
          {
            label: 'Success Rate',
            value: `${Math.round(averageSuccessRate)}%`,
            icon: <Zap className="h-5 w-5" />,
            color: 'text-orange-600'
          }
        ]);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Set default values in case of error
        setStats([
          {
            label: 'Total Projects',
            value: 0,
            icon: <FolderOpen className="h-5 w-5" />,
            color: 'text-blue-600'
          },
          {
            label: 'Successful Deployments',
            value: 0,
            icon: <CheckCircle className="h-5 w-5" />,
            color: 'text-green-600'
          },
          {
            label: 'Hours Saved',
            value: 0,
            icon: <Clock className="h-5 w-5" />,
            color: 'text-purple-600'
          },
          {
            label: 'Success Rate',
            value: '0%',
            icon: <Zap className="h-5 w-5" />,
            color: 'text-orange-600'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <Card key={index} className="border-slate-200/60">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full bg-slate-100 ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                {stat.trend && (
                  <div className="flex items-center mt-1">
                    <TrendingUp className={`h-4 w-4 ${stat.trend.isPositive ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`text-sm ml-1 ${stat.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend.value}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Default stats configuration
export const defaultStats: StatItem[] = [
  {
    label: 'Total Projects',
    value: 0,
    icon: <FolderOpen className="h-5 w-5" />,
    color: 'text-blue-600',
    trend: { value: 12, isPositive: true }
  },
  {
    label: 'Successful Deployments',
    value: 0,
    icon: <CheckCircle className="h-5 w-5" />,
    color: 'text-green-600',
    trend: { value: 8, isPositive: true }
  },
  {
    label: 'Hours Saved',
    value: 0,
    icon: <Clock className="h-5 w-5" />,
    color: 'text-purple-600',
    trend: { value: 15, isPositive: true }
  },
  {
    label: 'Active Pipelines',
    value: 0,
    icon: <Zap className="h-5 w-5" />,
    color: 'text-orange-600'
  }
]; 