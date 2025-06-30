import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Loader2, 
  AlertCircle, 
  ArrowLeft, 
  Github, 
  Mail,
  Rocket,
  Sparkles,
  Shield,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SignIn, SignUp } from '@clerk/clerk-react';
import type { Theme } from '@clerk/types';

export const Auth = () => {
  const [searchParams] = useSearchParams();
  const isSignUp = searchParams.get('sign-up') === 'true';

  const commonAppearance: Theme = {
    layout: {
      socialButtonsPlacement: "bottom" as const,
      logoPlacement: "inside" as const,
      termsPageUrl: "/terms",
      privacyPageUrl: "/privacy",
      showOptionalFields: false
    },
    elements: {
      rootBox: "w-full max-w-[450px] mx-auto",
      card: "shadow-xl border border-slate-200",
      headerTitle: "text-2xl font-bold text-slate-900",
      headerSubtitle: "text-slate-600",
      socialButtonsBlockButton: "bg-white border border-slate-200 hover:bg-slate-50 text-slate-800",
      formFieldLabel: "text-slate-700",
      formFieldInput: "border-2 border-slate-200 focus:border-purple-500",
      footerActionLink: "text-purple-600 hover:text-purple-700",
      formButtonPrimary: "bg-purple-600 hover:bg-purple-700",
      dividerLine: "bg-slate-200",
      dividerText: "text-slate-600 bg-white px-2",
      formFieldInputShowPasswordButton: "text-slate-600",
      identityPreviewEditButton: "text-purple-600 hover:text-purple-700",
      formFieldWarningText: "text-red-500"
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-[450px] mx-auto">
        {isSignUp ? (
          <SignUp
            routing="path"
            path="/auth"
            signInUrl="/auth"
            redirectUrl="/select-repo"
            appearance={commonAppearance}
          />
        ) : (
          <SignIn
            routing="path"
            path="/auth"
            signUpUrl="/auth?sign-up=true"
            redirectUrl="/select-repo"
            appearance={commonAppearance}
          />
        )}
      </div>
    </div>
  );
}; 