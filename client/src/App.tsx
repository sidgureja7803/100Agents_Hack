import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { GitHubProvider } from '@/contexts/GitHubContext';
import { Landing } from '@/pages/Landing';
import { Demo } from '@/pages/Demo';
import { Auth } from '@/pages/Auth';
import { NotFound } from '@/pages/NotFound';
import { ModernDashboard } from '@/pages/ModernDashboard';
import { GitHubCallback } from '@/pages/GitHubCallback';
import { RepoSelection } from '@/pages/RepoSelection';
import AuthSuccess from '@/pages/AuthSuccess';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <GitHubProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes - No Auth Required */}
            <Route element={<PublicLayout><Outlet /></PublicLayout>}>
              <Route path="/" element={<Landing />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/auth/success" element={<AuthSuccess />} />
            </Route>

            {/* Auth Routes - No Layout (Auth has its own header) */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/sign-in/*" element={<Auth />} />
            <Route path="/sign-up/*" element={<Auth />} />

          {/* Protected Routes - Auth Required */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Outlet />
                </DashboardLayout>
              </ProtectedRoute>
            }
          >
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<ModernDashboard />} />
            <Route path="/auth/github/callback" element={<GitHubCallback />} />
            <Route path="/select-repo" element={<RepoSelection />} />
            
            {/* Redirect /profile to /dashboard for now */}
            <Route path="/profile" element={<Navigate to="/dashboard" replace />} />
            
            {/* Redirect /login to /auth */}
            <Route path="/login" element={<Navigate to="/auth" replace />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </GitHubProvider>
  );
}

export default App;
