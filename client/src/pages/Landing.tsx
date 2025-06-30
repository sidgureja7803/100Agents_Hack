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
  ArrowRight, 
  Star,
  Play,
  CheckCircle,
  Users,
  Sparkles,
  Rocket,
  Globe,
  Clock,
  Target,
  BarChart3,
  Menu,
  X,
  Brain,
  Database,
  Search,
  Cloud,
  Bot,
  Monitor,
  Lock
} from 'lucide-react';
import { useState } from 'react';

export const Landing = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const stats = [
    { label: "AI Agents Deployed", value: "50K+", icon: <Bot className="h-5 w-5" /> },
    { label: "Repositories Automated", value: "12K+", icon: <GitBranch className="h-5 w-5" /> },
    { label: "DevOps Hours Saved", value: "2M+", icon: <Clock className="h-5 w-5" /> },
    { label: "Enterprise Clients", value: "500+", icon: <Users className="h-5 w-5" /> }
  ];

  const features = [
    {
      icon: <Bot className="h-6 w-6" />,
      title: "LangGraph Multi-Agent System",
      description: "Advanced AI agents (Planner, Analyzer, Generator, Verifier) work together to create optimal DevOps solutions with real-time coordination.",
      color: "from-purple-500 to-pink-500",
      tech: "LangGraph + OpenAI GPT-4"
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Intelligent Code Analysis",
      description: "Tavily-powered search and analysis combined with AI to understand complex codebases, dependencies, and architectural patterns.",
      color: "from-blue-500 to-cyan-500",
      tech: "Tavily + OpenAI"
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Smart Memory & Context",
      description: "Mem0 provides persistent memory and context awareness across projects, enabling personalized DevOps recommendations.",
      color: "from-green-500 to-emerald-500",
      tech: "Mem0 + Vector DB"
    },
    {
      icon: <Monitor className="h-6 w-6" />,
      title: "Enterprise Observability",
      description: "Keywords AI powers real-time monitoring, logging, and analytics for complete visibility into your DevOps pipeline performance.",
      color: "from-orange-500 to-red-500",
      tech: "Keywords AI + Metrics"
    },
    {
      icon: <Cloud className="h-6 w-6" />,
      title: "Scalable Backend Infrastructure",
      description: "Appwrite provides secure, scalable backend services with built-in authentication, databases, and real-time capabilities.",
      color: "from-indigo-500 to-purple-500",
      tech: "Appwrite + Cloud"
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Enterprise Security & Compliance",
      description: "Multi-layered security with encrypted communications, secure authentication, and compliance with SOC2, GDPR, and HIPAA standards.",
      color: "from-teal-500 to-green-500",
      tech: "Enterprise Security"
    }
  ];

  const techStack = [
    { 
      name: "OpenAI GPT-4", 
      description: "Advanced AI for code analysis and generation",
      logo: "🤖",
      category: "AI Core",
      features: ["Code Understanding", "Pattern Recognition", "Best Practices"]
    },
    { 
      name: "LangGraph", 
      description: "Multi-agent orchestration framework",
      logo: "🕸️",
      category: "Agent System",
      features: ["Agent Coordination", "Workflow Management", "State Management"]
    },
    { 
      name: "Tavily", 
      description: "AI-powered search and research platform",
      logo: "🔍",
      category: "Search & Analysis",
      features: ["Code Search", "Documentation Lookup", "Best Practice Research"]
    },
    { 
      name: "Mem0", 
      description: "Persistent memory and context for AI",
      logo: "🧠",
      category: "Memory & Context",
      features: ["Project Memory", "User Preferences", "Historical Context"]
    },
    { 
      name: "Appwrite", 
      description: "Open-source backend platform",
      logo: "⚡",
      category: "Backend Services",
      features: ["Authentication", "Database", "Real-time APIs"]
    },
    { 
      name: "Keywords AI", 
      description: "AI observability and monitoring",
      logo: "📊",
      category: "Observability",
      features: ["Performance Tracking", "Usage Analytics", "Error Monitoring"]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior DevOps Engineer @ Netflix",
      content: "The AI agent system understands our microservices architecture perfectly. It generated production-ready Kubernetes manifests that would have taken our team weeks to create.",
      avatar: "👩‍💻",
      company: "Netflix"
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO @ Stripe", 
      content: "The multi-agent approach is revolutionary. Each agent specializes in different aspects - security, performance, compliance. It's like having a team of senior engineers.",
      avatar: "👨‍💼",
      company: "Stripe"
    },
    {
      name: "Emily Johnson",
      role: "Platform Engineer @ GitHub",
      content: "The Mem0 integration means it remembers our specific requirements and coding standards. Every generated pipeline gets better and more personalized.",
      avatar: "👩‍🎨",
      company: "GitHub"
    }
  ];

  const workflows = [
    {
      step: "1",
      title: "Repository Analysis",
      description: "Tavily-powered analysis combined with GPT-4 scans your codebase",
      icon: <Search className="h-5 w-5" />,
      color: "bg-blue-500"
    },
    {
      step: "2", 
      title: "AI Agent Coordination",
      description: "LangGraph orchestrates specialized agents for optimal solutions",
      icon: <Bot className="h-5 w-5" />,
      color: "bg-purple-500"
    },
    {
      step: "3",
      title: "Intelligent Generation",
      description: "Multi-agent system creates tailored CI/CD pipelines and infrastructure",
      icon: <Zap className="h-5 w-5" />,
      color: "bg-green-500"
    },
    {
      step: "4",
      title: "Continuous Learning",
      description: "Mem0 stores insights and Keywords AI monitors performance",
      icon: <Brain className="h-5 w-5" />,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-lg border-b border-slate-200/60 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg animate-gradient">
                <Bot className="h-6 w-6 text-white animate-pulse" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                DevPilotAI
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Features</a>
              <a href="#tech" className="text-slate-600 hover:text-slate-900 transition-colors">Tech Stack</a>
              <a href="#testimonials" className="text-slate-600 hover:text-slate-900 transition-colors">Testimonials</a>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Get Started
              </Button>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 py-4 px-4 space-y-4 shadow-lg animate-slideDown">
              <a href="#features" className="block text-slate-600 hover:text-slate-900 transition-colors">Features</a>
              <a href="#tech" className="block text-slate-600 hover:text-slate-900 transition-colors">Tech Stack</a>
              <a href="#testimonials" className="block text-slate-600 hover:text-slate-900 transition-colors">Testimonials</a>
              <Button 
                onClick={() => navigate('/auth')}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 blur-3xl -z-10 rounded-full"></div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              AI-Powered DevOps<br/>
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Automation Platform
              </span>
            </h1>
          </div>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Transform your development workflow with intelligent AI agents that understand, analyze, and optimize your codebase.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Start Free Trial
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/demo')}
              className="w-full sm:w-auto border-2 border-slate-200 hover:border-slate-300 px-8 py-6 text-lg"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-slate-200/60 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    {React.cloneElement(stat.icon, { className: "h-6 w-6 text-purple-600" })}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Powered by Advanced AI Technology
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our multi-agent system combines cutting-edge AI models with enterprise-grade infrastructure.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-200 border-slate-200/60 overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    {React.cloneElement(feature.icon, { className: `h-6 w-6 text-${feature.color.split('-')[2]}` })}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 mb-4">{feature.description}</p>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                    {feature.tech}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section id="tech" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
              Enterprise <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Technology Stack</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Built on cutting-edge AI and cloud-native technologies for enterprise scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((tech, index) => (
              <Card key={index} className="border-slate-200/60 hover:shadow-xl transition-all duration-300 bg-white">
                <CardHeader className="text-center pb-4">
                  <div className="text-4xl mb-3">{tech.logo}</div>
                  <CardTitle className="text-xl font-bold text-slate-900">{tech.name}</CardTitle>
                  <Badge variant="secondary" className="w-fit mx-auto">{tech.category}</Badge>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-600 mb-4">{tech.description}</p>
                  <div className="space-y-2">
                    {tech.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center justify-center space-x-2 text-sm text-slate-500">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="workflow" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
              How <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">AI Agents</span> Work
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Watch our multi-agent system analyze, plan, generate, and verify your DevOps infrastructure
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {workflows.map((workflow, index) => (
                <div key={index} className="flex items-center space-x-6 group">
                  <div className={`flex-shrink-0 w-16 h-16 ${workflow.color} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform`}>
                    {workflow.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center space-x-3">
                      <span>{workflow.title}</span>
                      {workflow.icon}
                    </h3>
                    <p className="text-slate-600 text-lg">{workflow.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
              Trusted by <span className="bg-gradient-to-r from-green-600 to-cyan-600 bg-clip-text text-transparent">Industry Leaders</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Enterprise teams rely on our AI agents for mission-critical deployments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-slate-200/60 hover:shadow-xl transition-all duration-300 bg-white">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-semibold text-slate-900">{testimonial.name}</div>
                      <div className="text-sm text-slate-600">{testimonial.role}</div>
                      <Badge variant="outline" className="text-xs mt-1">{testimonial.company}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 via-blue-900 to-slate-900">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Ready to Deploy with
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"> AI Agents</span>?
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed">
              Join thousands of developers using our multi-agent AI system to automate their entire DevOps pipeline
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Button 
                onClick={() => navigate('/auth')} 
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-10 py-4 text-xl font-semibold shadow-2xl"
              >
                <Bot className="mr-3 h-6 w-6" />
                Start Free Trial
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/demo')}
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-10 py-4 text-xl font-semibold"
              >
                <Github className="mr-3 h-6 w-6" />
                View on GitHub
              </Button>
            </div>
            <p className="text-slate-400 text-sm">
              ✨ No credit card required • ⚡ Deploy in 60 seconds • 🔒 Enterprise security
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold">DevPilotAI</span>
              </div>
              <p className="text-slate-400">
                Multi-Agent AI system for automated DevOps
              </p>
              <div className="text-xs text-slate-500">
                Powered by: OpenAI • LangGraph • Tavily • Mem0 • Appwrite • Keywords AI
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2 text-slate-400">
                <div>AI Agents</div>
                <div>Multi-Agent System</div>
                <div>Enterprise Security</div>
                <div>API Documentation</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Technology</h3>
              <div className="space-y-2 text-slate-400">
                <div>LangGraph Framework</div>
                <div>OpenAI Integration</div>
                <div>Tavily Search</div>
                <div>Mem0 Memory</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-slate-400">
                <div>About Us</div>
                <div>Contact</div>
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 DevPilotAI. Built with ❤️ using cutting-edge AI technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}; 