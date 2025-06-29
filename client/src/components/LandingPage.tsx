import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Code2, 
  Zap, 
  Shield, 
  GitBranch, 
  Container, 
  Github, 
  FileText, 
  Settings, 
  Play,
  CheckCircle,
  Lock,
  Eye,
  UserCheck
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <Code2 className="h-8 w-8" />,
      title: "Smart Repository Analysis",
      description: "AI-powered analysis of your codebase to generate optimal DevOps configurations"
    },
    {
      icon: <Container className="h-8 w-8" />,
      title: "Production-Ready Dockerfiles",
      description: "Multi-stage, optimized Docker configurations with security best practices"
    },
    {
      icon: <GitBranch className="h-8 w-8" />,
      title: "Complete CI/CD Pipelines",
      description: "GitHub Actions workflows with testing, building, and deployment automation"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Environment Templates",
      description: "Comprehensive .env.example files with all necessary configuration variables"
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: "Deployment Documentation",
      description: "Step-by-step guides for deploying to various cloud platforms"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Generation",
      description: "Get complete DevOps setup in seconds, not hours of manual configuration"
    }
  ];

  const techStack = [
    { name: "Superdev", description: "Modern React development platform", logo: "🚀" },
    { name: "Tavily", description: "AI-powered web search and documentation", logo: "🔍" },
    { name: "Mem0", description: "Persistent memory and context management", logo: "🧠" },
    { name: "Keywords AI", description: "Advanced observability and analytics", logo: "📊" },
    { name: "Appwrite", description: "Backend-as-a-Service platform", logo: "⚡" }
  ];

  const securityFeatures = [
    {
      icon: <Lock className="h-6 w-6" />,
      title: "No Code Storage",
      description: "Your source code is analyzed but never stored on our servers without explicit consent"
    },
    {
      icon: <UserCheck className="h-6 w-6" />,
      title: "OAuth Authentication",
      description: "Secure login with Google and GitHub - we never see your passwords"
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Server-Side Processing",
      description: "All API keys and sensitive operations are handled securely on our backend"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
            🚀 AI-Powered DevOps Assistant
          </Badge>
          
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent leading-tight">
            DevPilotAI
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-3xl mx-auto">
            Transform any GitHub repository into a production-ready deployment with AI-generated CI/CD pipelines, 
            Dockerfiles, and comprehensive documentation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              onClick={() => navigate('/login')}
            >
              <Play className="mr-2 h-5 w-5" />
              Get Started Free
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
              <Github className="mr-2 h-5 w-5" />
              View on GitHub
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Everything You Need for Modern DevOps
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            From repository analysis to production deployment, DevPilotAI handles the entire DevOps pipeline generation process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-slate-200/60 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Built With Section */}
      <section className="container mx-auto px-4 py-16 bg-white/50">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Built With Modern AI Tools
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            DevPilotAI leverages cutting-edge AI platforms and development tools to deliver the best DevOps automation experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((tech, index) => (
            <Card key={index} className="border-slate-200/60 hover:shadow-md transition-shadow">
              <CardContent className="flex items-center space-x-4 p-6">
                <div className="text-3xl">{tech.logo}</div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-900">{tech.name}</h3>
                  <p className="text-sm text-slate-600">{tech.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Security Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <h2 className="text-4xl font-bold text-slate-900">
                🔐 Security First
              </h2>
            </div>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Your code and data privacy are our top priorities. Here's how we keep your projects secure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="border-slate-200/60 text-center">
                <CardHeader>
                  <div className="mx-auto p-3 bg-green-100 rounded-full text-green-600 w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 p-6 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Additional Security Measures</h3>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• All communications encrypted with TLS 1.3</li>
                  <li>• Repository access through read-only GitHub tokens</li>
                  <li>• Generated configurations reviewed by AI safety filters</li>
                  <li>• Regular security audits and compliance monitoring</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl font-bold text-slate-900">
            Ready to Automate Your DevOps?
          </h2>
          <p className="text-xl text-slate-600">
            Join thousands of developers who have streamlined their deployment process with AI-generated configurations.
          </p>
          <Button 
            size="lg" 
            className="px-12 py-4 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            onClick={() => navigate('/login')}
          >
            <Zap className="mr-2 h-5 w-5" />
            Start Generating Now
          </Button>
        </div>
      </section>
    </div>
  );
}; 