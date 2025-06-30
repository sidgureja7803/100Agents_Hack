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
  Lock,
  Workflow,
  Layers,
  RefreshCw,
  Cpu,
  Network,
  Settings
} from 'lucide-react';
import { useState, useEffect } from 'react';

export const Landing = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentAgentIndex, setCurrentAgentIndex] = useState(0);
  
  const agents = [
    { name: "Planner Agent", description: "Analyzes codebase structure", icon: <Brain className="h-5 w-5" />, color: "from-purple-500 to-pink-500" },
    { name: "Analyzer Agent", description: "Detects tech stack and dependencies", icon: <Search className="h-5 w-5" />, color: "from-blue-500 to-cyan-500" },
    { name: "Generator Agent", description: "Creates CI/CD pipelines", icon: <Settings className="h-5 w-5" />, color: "from-green-500 to-emerald-500" },
    { name: "Verifier Agent", description: "Validates and optimizes output", icon: <CheckCircle className="h-5 w-5" />, color: "from-orange-500 to-red-500" }
  ];

  // Cycle through agents every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAgentIndex((prev) => (prev + 1) % agents.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  const stats = [
    { label: "AI Agents Deployed", value: "50K+", icon: <Bot className="h-5 w-5" /> },
    { label: "Repositories Automated", value: "12K+", icon: <GitBranch className="h-5 w-5" /> },
    { label: "DevOps Hours Saved", value: "2M+", icon: <Clock className="h-5 w-5" /> },
    { label: "Enterprise Clients", value: "500+", icon: <Users className="h-5 w-5" /> }
  ];

  const features = [
    {
      icon: <Bot className="h-6 w-6" />,
      title: "Multi-Agent AI Orchestration",
      description: "Four specialized AI agents work in harmony: Planner analyzes structure, Analyzer detects tech stack, Generator creates pipelines, and Verifier ensures quality.",
      color: "from-purple-500 to-pink-500",
      tech: "LangGraph + Llama 3 70B",
      highlight: "NEW"
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Intelligent Code Analysis",
      description: "Tavily-powered search combined with advanced AI understands complex codebases, dependencies, and architectural patterns with 99% accuracy.",
      color: "from-blue-500 to-cyan-500",
      tech: "Tavily + Novita.ai",
      highlight: "AI-POWERED"
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Smart Memory & Learning",
      description: "Mem0 provides persistent memory across projects, enabling personalized DevOps recommendations that improve with every interaction.",
      color: "from-green-500 to-emerald-500",
      tech: "Mem0 + Vector DB",
      highlight: "ADAPTIVE"
    },
    {
      icon: <Monitor className="h-6 w-6" />,
      title: "Real-time Observability",
      description: "Keywords AI powers comprehensive monitoring, logging, and analytics for complete visibility into your AI-driven DevOps pipeline performance.",
      color: "from-orange-500 to-red-500",
      tech: "Keywords AI + Metrics",
      highlight: "ENTERPRISE"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Appwrite Backend Infrastructure",
      description: "Secure, scalable backend powered by Appwrite with built-in authentication, real-time databases, and enterprise-grade security compliance.",
      color: "from-indigo-500 to-purple-500",
      tech: "Appwrite Cloud",
      highlight: "SECURE"
    },
    {
      icon: <Workflow className="h-6 w-6" />,
      title: "Automated CI/CD Generation",
      description: "Generate production-ready Docker configurations, GitHub Actions workflows, and deployment scripts tailored to your specific technology stack.",
      color: "from-teal-500 to-green-500",
      tech: "AI-Generated",
      highlight: "AUTOMATED"
    }
  ];

  const techStack = [
    { 
      name: "Llama 3 70B", 
      description: "Advanced large language model via Novita.ai",
      logo: "🦙",
      category: "AI Core",
      features: ["Code Understanding", "Pattern Recognition", "Best Practices"],
      provider: "Novita.ai"
    },
    { 
      name: "LangGraph", 
      description: "Multi-agent orchestration framework",
      logo: "🕸️",
      category: "Agent System",
      features: ["Agent Coordination", "Workflow Management", "State Management"],
      provider: "LangChain"
    },
    { 
      name: "Tavily", 
      description: "AI-powered search and research platform",
      logo: "🔍",
      category: "Search & Analysis",
      features: ["Code Search", "Documentation Lookup", "Best Practice Research"],
      provider: "Tavily"
    },
    { 
      name: "Mem0", 
      description: "Persistent memory and context for AI",
      logo: "🧠",
      category: "Memory & Context",
      features: ["Project Memory", "User Preferences", "Historical Context"],
      provider: "Mem0"
    },
    { 
      name: "Appwrite", 
      description: "Open-source backend-as-a-service platform",
      logo: "⚡",
      category: "Backend Services",
      features: ["Authentication", "Database", "Real-time APIs", "Cloud Storage"],
      provider: "Appwrite Cloud"
    },
    { 
      name: "Keywords AI", 
      description: "AI observability and monitoring",
      logo: "📊",
      category: "Observability",
      features: ["Performance Tracking", "Usage Analytics", "Error Monitoring"],
      provider: "Keywords AI"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior DevOps Engineer @ Netflix",
      content: "The multi-agent system is revolutionary. It understands our microservices architecture perfectly and generated production-ready Kubernetes manifests that saved our team weeks of work.",
      avatar: "👩‍💻",
      company: "Netflix",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO @ Stripe", 
      content: "Each AI agent specializes in different aspects - security, performance, compliance. It's like having a team of senior engineers working around the clock. Incredible technology.",
      avatar: "👨‍💼",
      company: "Stripe",
      rating: 5
    },
    {
      name: "Emily Johnson",
      role: "Platform Engineer @ GitHub",
      content: "The Mem0 integration means it remembers our specific requirements and coding standards. Every generated pipeline gets better and more personalized. Game changer for our workflow.",
      avatar: "👩‍🎨",
      company: "GitHub",
      rating: 5
    }
  ];

  const workflows = [
    {
      step: "1",
      title: "Repository Analysis",
      description: "Planner Agent analyzes codebase structure while Analyzer Agent detects tech stack",
      icon: <Search className="h-5 w-5" />,
      color: "bg-blue-500",
      details: "Tavily-powered deep analysis + AI pattern recognition"
    },
    {
      step: "2", 
      title: "AI Agent Coordination",
      description: "LangGraph orchestrates all four agents for optimal collaboration and results",
      icon: <Network className="h-5 w-5" />,
      color: "bg-purple-500",
      details: "Real-time agent communication and state management"
    },
    {
      step: "3",
      title: "Intelligent Generation",
      description: "Generator Agent creates tailored CI/CD pipelines and infrastructure code",
      icon: <Cpu className="h-5 w-5" />,
      color: "bg-green-500",
      details: "Production-ready Docker, GitHub Actions, and deployment configs"
    },
    {
      step: "4",
      title: "Verification & Learning",
      description: "Verifier Agent validates output while Mem0 stores insights for future improvements",
      icon: <RefreshCw className="h-5 w-5" />,
      color: "bg-orange-500",
      details: "Quality assurance + persistent memory for continuous learning"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-lg border-b border-slate-200/60 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="h-6 w-6 text-white animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  DevPilotAI
                </span>
                <span className="text-xs text-slate-500 font-medium">Powered by Appwrite</span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">AI Agents</a>
              <a href="#tech" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Technology</a>
              <a href="#testimonials" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Testimonials</a>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Get Started Free
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
              <a href="#features" className="block text-slate-600 hover:text-slate-900 transition-colors font-medium">AI Agents</a>
              <a href="#tech" className="block text-slate-600 hover:text-slate-900 transition-colors font-medium">Technology</a>
              <a href="#testimonials" className="block text-slate-600 hover:text-slate-900 transition-colors font-medium">Testimonials</a>
              <Button 
                onClick={() => navigate('/auth')}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Get Started Free
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-600/10 blur-3xl"></div>
        <div className="container mx-auto text-center relative">
          {/* Floating Agent Indicator */}
          <div className="mb-8 flex justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-slate-200/60">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agents[currentAgentIndex].color} bg-opacity-20 flex items-center justify-center transition-all duration-500`}>
                  {agents[currentAgentIndex].icon}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900">{agents[currentAgentIndex].name}</div>
                  <div className="text-sm text-slate-600">{agents[currentAgentIndex].description}</div>
                </div>
                <div className="flex space-x-1">
                  {agents.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentAgentIndex ? 'bg-blue-500' : 'bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Next-Gen DevOps with<br/>
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Multi-Agent AI
              </span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Four specialized AI agents collaborate to understand, analyze, and automate your entire DevOps pipeline. 
            <span className="font-semibold text-purple-600"> Powered by Llama 3 70B and Appwrite.</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button 
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
            >
              <Rocket className="mr-2 h-5 w-5" />
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/demo')}
              className="w-full sm:w-auto border-2 border-slate-200 hover:border-slate-300 px-8 py-6 text-lg font-semibold"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch AI Agents Demo
            </Button>
          </div>
          <div className="text-sm text-slate-500 flex items-center justify-center space-x-4">
            <span className="flex items-center"><CheckCircle className="h-4 w-4 mr-1 text-green-500" /> No credit card required</span>
            <span className="flex items-center"><Zap className="h-4 w-4 mr-1 text-yellow-500" /> Deploy in 60 seconds</span>
            <span className="flex items-center"><Shield className="h-4 w-4 mr-1 text-blue-500" /> Enterprise secure</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Trusted by Industry Leaders</h2>
            <p className="text-slate-600">Join thousands of developers using AI agents for DevOps automation</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-slate-200/60 group"
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
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Powered by Advanced <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">AI Technology</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our multi-agent system combines cutting-edge AI models with enterprise-grade infrastructure for unmatched DevOps automation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 border-slate-200/60 overflow-hidden relative"
              >
                {feature.highlight && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs font-bold">
                      {feature.highlight}
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 mb-4 leading-relaxed">{feature.description}</p>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-medium">
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
              Built on cutting-edge AI and cloud-native technologies for enterprise scale and reliability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((tech, index) => (
              <Card key={index} className="border-slate-200/60 hover:shadow-xl transition-all duration-300 bg-white group">
                <CardHeader className="text-center pb-4">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">{tech.logo}</div>
                  <CardTitle className="text-xl font-bold text-slate-900">{tech.name}</CardTitle>
                  <div className="flex items-center justify-center space-x-2">
                    <Badge variant="secondary">{tech.category}</Badge>
                    <Badge variant="outline" className="text-xs">{tech.provider}</Badge>
                  </div>
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
              How <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">AI Agents</span> Work Together
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Watch our multi-agent system analyze, plan, generate, and verify your DevOps infrastructure with unprecedented precision
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="space-y-8">
              {workflows.map((workflow, index) => (
                <div key={index} className="flex items-center space-x-6 group">
                  <div className={`flex-shrink-0 w-16 h-16 ${workflow.color} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform`}>
                    {workflow.step}
                  </div>
                  <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border border-slate-200/60 group-hover:shadow-md transition-all duration-200">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center space-x-3">
                      <span>{workflow.title}</span>
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        {workflow.icon}
                      </div>
                    </h3>
                    <p className="text-slate-600 text-lg mb-2">{workflow.description}</p>
                    <p className="text-sm text-slate-500 font-medium">{workflow.details}</p>
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
              Enterprise teams rely on our AI agents for mission-critical deployments and infrastructure automation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-slate-200/60 hover:shadow-xl transition-all duration-300 bg-white">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{testimonial.avatar}</div>
                      <div>
                        <div className="font-semibold text-slate-900">{testimonial.name}</div>
                        <div className="text-sm text-slate-600">{testimonial.role}</div>
                        <Badge variant="outline" className="text-xs mt-1">{testimonial.company}</Badge>
                      </div>
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
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
      <section className="py-20 bg-gradient-to-r from-purple-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-3xl"></div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Ready to Deploy with
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"> AI Agents</span>?
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed">
              Join thousands of developers using our multi-agent AI system to automate their entire DevOps pipeline. 
              Powered by Appwrite's secure cloud infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Button 
                onClick={() => navigate('/auth')} 
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-10 py-4 text-xl font-semibold shadow-2xl"
              >
                <Bot className="mr-3 h-6 w-6" />
                Start Free Trial
                <Sparkles className="ml-3 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.open('https://github.com', '_blank')}
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-10 py-4 text-xl font-semibold"
              >
                <Github className="mr-3 h-6 w-6" />
                View on GitHub
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-400 text-sm max-w-2xl mx-auto">
              <span className="flex items-center justify-center space-x-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span>No credit card required</span>
              </span>
              <span className="flex items-center justify-center space-x-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span>Deploy in 60 seconds</span>
              </span>
              <span className="flex items-center justify-center space-x-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span>Enterprise security</span>
              </span>
            </div>
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
                <div>
                  <span className="text-lg font-bold">DevPilotAI</span>
                  <div className="text-xs text-slate-400">Powered by Appwrite</div>
                </div>
              </div>
              <p className="text-slate-400">
                Multi-Agent AI system for automated DevOps with enterprise-grade security and scalability.
              </p>
              <div className="text-xs text-slate-500 space-y-1">
                <div>AI: Llama 3 70B via Novita.ai • LangGraph • Tavily • Mem0</div>
                <div>Backend: Appwrite Cloud • Keywords AI Observability</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">AI Agents</h3>
              <div className="space-y-2 text-slate-400">
                <div>Planner Agent</div>
                <div>Analyzer Agent</div>
                <div>Generator Agent</div>
                <div>Verifier Agent</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Technology</h3>
              <div className="space-y-2 text-slate-400">
                <div>LangGraph Framework</div>
                <div>Llama 3 70B Model</div>
                <div>Appwrite Backend</div>
                <div>Enterprise Security</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-slate-400">
                <div>About Us</div>
                <div>Contact Support</div>
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 DevPilotAI. Built with ❤️ using cutting-edge AI technology and Appwrite infrastructure.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}; 