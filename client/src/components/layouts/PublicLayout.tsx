import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Rocket } from 'lucide-react';

interface PublicLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  showHeader?: boolean;
  headerTitle?: string;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ 
  children, 
  showBackButton = true,
  showHeader = true,
  headerTitle = "DevPilotAI"
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50">
      {showHeader && (
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {showBackButton && (
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
            )}
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Rocket className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">{headerTitle}</span>
            </div>
            
            {!showBackButton && <div />} {/* Spacer for center alignment */}
          </div>
        </div>
      )}
      
      <main>
        {children}
      </main>
    </div>
  );
}; 