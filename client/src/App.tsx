import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Landing } from '@/pages/Landing';
import { Demo } from '@/pages/Demo';
import { Auth } from '@/pages/Auth';
import { NotFound } from '@/pages/NotFound';
import { EnhancedDashboard } from '@/pages/EnhancedDashboard';
import { RepoSelection } from '@/pages/RepoSelection';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Router>
        <Routes>
          {/* Public Routes - No Auth Required */}
          <Route element={<PublicLayout><Outlet /></PublicLayout>}>
            <Route path="/" element={<Landing />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/sign-in/*" element={<Auth />} />
            <Route path="/sign-up/*" element={<Auth />} />
          </Route>

          {/* Protected Routes - Auth Required */}
          <Route
            element={
              <>
                <SignedIn>
                  <DashboardLayout>
                    <Outlet />
                  </DashboardLayout>
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          >
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<EnhancedDashboard />} />
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
    </ClerkProvider>
  );
}

export default App;
