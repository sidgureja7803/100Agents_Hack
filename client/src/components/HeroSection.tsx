import { Code2, Zap, Shield, GitBranch } from 'lucide-react';

export const HeroSection = () => {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent leading-tight">
          DevPilotAI
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 font-medium">
          Your AI-Powered DevOps Assistant
        </p>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Automatically generate production-ready CI/CD pipelines, Dockerfiles, and deployment configurations 
          for your GitHub repositories in seconds.
        </p>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-12">
        <div className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-slate-200/60">
          <Code2 className="h-8 w-8 text-blue-600" />
          <span className="text-sm font-medium text-slate-700">Smart Analysis</span>
        </div>
        <div className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-slate-200/60">
          <Zap className="h-8 w-8 text-blue-600" />
          <span className="text-sm font-medium text-slate-700">Instant Setup</span>
        </div>
        <div className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-slate-200/60">
          <Shield className="h-8 w-8 text-blue-600" />
          <span className="text-sm font-medium text-slate-700">Best Practices</span>
        </div>
        <div className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-slate-200/60">
          <GitBranch className="h-8 w-8 text-blue-600" />
          <span className="text-sm font-medium text-slate-700">Multi-Platform</span>
        </div>
      </div>
    </div>
  );
};