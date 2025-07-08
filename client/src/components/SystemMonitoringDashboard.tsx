import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Clock, 
  Users, 
  Server, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Database,
  Cpu,
  HardDrive
} from 'lucide-react';

interface SystemMetrics {
  uptime: number;
  requests: {
    total: number;
    errors: number;
    successRate: number;
    avgResponseTime: number;
  };
  memory: {
    rss: number;
    heapUsed: number;
    heapTotal: number;
    formatted: {
      rss: string;
      heapUsed: string;
      heapTotal: string;
    };
  };
  activeSessions: number;
  timestamp: number;
}

interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: string;
  version: string;
  environment: string;
  metrics: {
    requests: {
      total: number;
      errors: number;
      successRate: number;
      avgResponseTime: number;
    };
    memory: {
      rss: string;
      heapUsed: string;
      heapTotal: string;
    };
    activeSessions: number;
  };
  sessionAnalytics: {
    total: number;
    avgDuration: string;
    phases: number;
  };
}

export const SystemMonitoringDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/metrics');
        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }
        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    const fetchHealthStatus = async () => {
      try {
        const response = await fetch('/health');
        if (!response.ok) {
          throw new Error('Failed to fetch health status');
        }
        const data = await response.json();
        setHealthStatus(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    fetchHealthStatus();

    // Update metrics every 30 seconds
    const interval = setInterval(() => {
      fetchMetrics();
      fetchHealthStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getMemoryUsagePercentage = () => {
    if (!metrics) return 0;
    return (metrics.memory.heapUsed / metrics.memory.heapTotal) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load system metrics: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">System Monitoring</h2>
        <Badge 
          variant={healthStatus?.status === 'healthy' ? 'default' : 'destructive'}
          className={`${getStatusColor(healthStatus?.status || 'unknown')} bg-opacity-10`}
        >
          <Activity className="h-3 w-3 mr-1" />
          {healthStatus?.status || 'Unknown'}
        </Badge>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-blue-600" />
              Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthStatus?.uptime || '0h 0m'}</div>
            <p className="text-xs text-gray-600">System running time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
              Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.requests.total || 0}</div>
            <p className="text-xs text-gray-600">
              {metrics?.requests.successRate.toFixed(1) || 0}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 text-purple-600" />
              Active Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.activeSessions || 0}</div>
            <p className="text-xs text-gray-600">Currently processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Server className="h-4 w-4 mr-2 text-orange-600" />
              Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.requests.avgResponseTime.toFixed(0) || 0}ms
            </div>
            <p className="text-xs text-gray-600">Average response time</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Memory Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HardDrive className="h-5 w-5 mr-2" />
              Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Heap Used</span>
                <span>{metrics?.memory.formatted.heapUsed || '0MB'}</span>
              </div>
              <Progress value={getMemoryUsagePercentage()} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">RSS:</span>
                <span className="ml-2 font-medium">{metrics?.memory.formatted.rss || '0MB'}</span>
              </div>
              <div>
                <span className="text-gray-600">Heap Total:</span>
                <span className="ml-2 font-medium">{metrics?.memory.formatted.heapTotal || '0MB'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Session Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {healthStatus?.sessionAnalytics.total || 0}
                </div>
                <p className="text-xs text-gray-600">Total Sessions</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {healthStatus?.sessionAnalytics.avgDuration || '0ms'}
                </div>
                <p className="text-xs text-gray-600">Avg Duration</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Analysis Phases:</span>
              <Badge variant="outline">
                {healthStatus?.sessionAnalytics.phases || 0} types
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium">API Status</span>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-800">
                Healthy
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Cpu className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium">Agent System</span>
              </div>
              <Badge variant="default" className="bg-blue-100 text-blue-800">
                Active
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <HardDrive className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="text-sm font-medium">Memory Usage</span>
              </div>
              <Badge 
                variant="outline" 
                className={`${getMemoryUsagePercentage() > 80 ? 'border-yellow-300 text-yellow-800' : 'border-green-300 text-green-800'}`}
              >
                {getMemoryUsagePercentage().toFixed(1)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Updated */}
      <div className="text-right">
        <p className="text-xs text-gray-500">
          Last updated: {new Date(metrics?.timestamp || Date.now()).toLocaleString()}
        </p>
      </div>
    </div>
  );
};
