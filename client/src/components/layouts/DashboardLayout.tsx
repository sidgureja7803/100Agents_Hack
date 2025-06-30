import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { 
  LogOut, 
  User, 
  Rocket,
  Bell,
  HelpCircle,
  Github,
  LayoutDashboard,
  GitBranch
} from 'lucide-react';
import { GitHubConnect } from '@/components/GitHubConnect';
import { useUser, SignOutButton } from '@clerk/clerk-react';
import { useNavigate, Link } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title = "Dashboard",
  subtitle 
}) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const githubUser = user?.publicMetadata?.githubUsername as string;
  const avatarUrl = user?.imageUrl;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Rocket className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">DevPilotAI</h1>
              </Link>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                {title}
              </Badge>
            </div>
            
            {/* Navigation and User Menu */}
            <div className="flex items-center space-x-4">
              {/* Main Navigation */}
              <nav className="hidden md:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center space-x-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/select-repo')}
                  className="flex items-center space-x-2"
                >
                  <GitBranch className="h-4 w-4" />
                  <span>Repositories</span>
                </Button>
              </nav>

              {/* GitHub Username Display */}
              {githubUser && (
                <div className="hidden sm:flex items-center text-sm text-slate-600">
                  <Github className="h-4 w-4 mr-1" />
                  {githubUser}
                </div>
              )}
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={avatarUrl} alt={user?.fullName || 'User avatar'} />
                      <AvatarFallback>
                        {user?.fullName?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.fullName}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/select-repo')}>
                    <GitBranch className="mr-2 h-4 w-4" />
                    Repositories
                  </DropdownMenuItem>
                  <Separator />
                  <SignOutButton>
                    <DropdownMenuItem>
                      <div className="flex items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </div>
                    </DropdownMenuItem>
                  </SignOutButton>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <GitHubConnect />
          <div className="max-w-7xl mx-auto">
            {subtitle && (
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
                <p className="text-slate-600 mt-2">{subtitle}</p>
              </div>
            )}
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}; 