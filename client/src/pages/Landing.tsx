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
  X
} from 'lucide-react';
import { useState } from 'react';

export const Landing = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const stats = [
    { label: "Repositories Automated", value: "50K+", icon: <GitBranch className="h-5 w-5" /> },
    { label: "Active Developers", value: "12K+", icon: <Users className="h-5 w-5" /> },
    { label: "Hours Saved", value: "500K+", icon: <Clock className="h-5 w-5" /> },
    { label: "Success Rate", value: "99.9%", icon: <Target className="h-5 w-5" /> }
  ];

  const features = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning models analyze your codebase structure, dependencies, and patterns to generate optimal DevOps configurations.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Container className="h-6 w-6" />,
      title: "Smart Containerization",
      description: "Generate production-ready Dockerfiles with multi-stage builds, security best practices, and optimal layer caching.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <GitBranch className="h-6 w-6" />,
      title: "Complete CI/CD Pipelines",
      description: "Full GitHub Actions workflows with testing, security scanning, building, and deployment automation across multiple environments.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise Security",
      description: "Built-in security scanning, vulnerability detection, and compliance checks to ensure your deployments meet industry standards.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Multi-Cloud Ready",
      description: "Deploy seamlessly to AWS, GCP, Azure, Vercel, Netlify, and other major cloud platforms with optimized configurations.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Real-time Monitoring",
      description: "Integrated observability with logging, metrics, and alerting to keep your applications running smoothly in production.",
      color: "from-teal-500 to-green-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior DevOps Engineer @ TechCorp",
      content: "DevPilotAI reduced our deployment setup time from weeks to minutes. The generated configurations are production-ready and follow all best practices.",
      avatar: "👩‍💻"
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO @ StartupXYZ", 
      content: "As a startup, we don't have dedicated DevOps resources. DevPilotAI gave us enterprise-level deployment pipelines instantly.",
      avatar: "👨‍💼"
    },
    {
      name: "Emily Johnson",
      role: "Full-Stack Developer",
      content: "The AI understands complex monorepo structures perfectly. It generated separate pipelines for each service with proper dependencies.",
      avatar: "👩‍🎨"
    }
  ];

  const techStack = [
    { name: "OpenAI GPT-4", description: "Advanced code analysis", logo: "🤖" },
    { name: "Docker", description: "Containerization platform", logo: "🐳" },
    { name: "GitHub Actions", description: "CI/CD automation", logo: "⚡" },
    { name: "Kubernetes", description: "Container orchestration", logo: "☸️" },
    { name: "Terraform", description: "Infrastructure as code", logo: "🏗️" },
    { name: "AWS/GCP/Azure", description: "Multi-cloud deployment", logo: "☁️" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-lg border-b border-slate-200/60 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Rocket className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">DevPilotAI</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-purple-600 transition-colors">Features</a>
              <a href="#testimonials" className="text-slate-600 hover:text-purple-600 transition-colors">Testimonials</a>
              <a href="#tech" className="text-slate-600 hover:text-purple-600 transition-colors">Technology</a>
              <Button variant="outline" onClick={() => navigate('/demo')}>
                Try Demo
              </Button>
              <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Get Started Free
              </Button>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-slate-200/60">
              <div className="flex flex-col space-y-4 mt-4">
                <a href="#features" className="text-slate-600 hover:text-purple-600 transition-colors">Features</a>
                <a href="#testimonials" className="text-slate-600 hover:text-purple-600 transition-colors">Testimonials</a>
                <a href="#tech" className="text-slate-600 hover:text-purple-600 transition-colors">Technology</a>
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" onClick={() => navigate('/demo')} className="w-full">
                    Try Demo
                  </Button>
                  <Button onClick={() => navigate('/auth')} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Get Started Free
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(156,146,172,0.15) 1px, transparent 0)",
            backgroundSize: "20px 20px"
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-5xl mx-auto text-center space-y-12">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <span className="text-white font-medium">AI-Powered DevOps Revolution</span>
              <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                NEW
              </Badge>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl font-bold text-white leading-tight">
                Deploy
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  {" "}Anything
                </span>
                <br />
                <span className="text-5xl md:text-7xl">Anywhere</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                Transform any GitHub repository into production-ready deployments with AI-generated CI/CD pipelines, 
                Dockerfiles, and infrastructure code in <span className="text-purple-400 font-semibold">under 60 seconds</span>.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                className="px-12 py-6 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
                onClick={() => navigate('/auth')}
              >
                <Rocket className="mr-3 h-6 w-6" />
                Start Building Free
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-12 py-6 text-lg border-white/30 text-white hover:bg-white/10 rounded-full backdrop-blur-sm"
                onClick={() => navigate('/demo')}
              >
                <Play className="mr-3 h-5 w-5" />
                Try Demo
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/10">
              {stats.map((stat, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-purple-400">
                    {stat.icon}
                    <span className="text-3xl md:text-4xl font-bold text-white">{stat.value}</span>
                  </div>
                  <p className="text-slate-300 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-purple-100 rounded-full px-4 py-2 mb-6">
              <Star className="h-4 w-4 text-purple-600" />
              <span className="text-purple-700 font-medium text-sm">FEATURES</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Everything You Need,
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Nothing You Don&apos;t
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Our AI doesn&apos;t just generate code—it understands your project architecture, 
              scales with your needs, and follows industry best practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${feature.color} mb-4 w-fit group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 leading-relaxed text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-r from-purple-900 via-slate-900 to-purple-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Users className="h-4 w-4 text-purple-400" />
              <span className="text-purple-300 font-medium text-sm">TESTIMONIALS</span>
            </div>
            <h2 className="text-5xl font-bold text-white mb-6">
              Loved by Developers
              <br />
              <span className="text-purple-400">Worldwide</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-white/90 mb-6 leading-relaxed">&quot;{testimonial.content}&quot;</p>
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{testimonial.avatar}</div>
                    <div>
                      <p className="text-white font-semibold">{testimonial.name}</p>
                      <p className="text-purple-300 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-slate-100 rounded-full px-4 py-2 mb-6">
              <Code2 className="h-4 w-4 text-slate-600" />
              <span className="text-slate-700 font-medium text-sm">TECHNOLOGY</span>
            </div>
            <h2 className="text-5xl font-bold text-slate-900 mb-6">
              Built on the
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Best Stack
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We leverage cutting-edge technologies and industry-standard tools to deliver reliable, scalable solutions.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {techStack.map((tech, index) => (
              <Card key={index} className="group border-slate-200/60 hover:shadow-lg hover:border-purple-200 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="flex flex-col items-center text-center p-6 space-y-3">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{tech.logo}</div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors">{tech.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{tech.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: "linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%)",
            backgroundSize: "20px 20px"
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Ready to Ship
                <br />
                <span className="text-purple-200">10x Faster?</span>
              </h2>
              <p className="text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
                Join thousands of developers who&apos;ve automated their DevOps workflow. 
                Start deploying with confidence in minutes, not months.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                className="px-12 py-6 text-lg bg-white text-purple-600 hover:bg-slate-50 rounded-full shadow-2xl hover:shadow-white/20 transition-all duration-300 font-semibold"
                onClick={() => navigate('/auth')}
              >
                <Zap className="mr-3 h-6 w-6" />
                Start Free Trial
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-12 py-6 text-lg border-white/30 text-white hover:bg-white/10 rounded-full backdrop-blur-sm"
                onClick={() => window.open('https://github.com', '_blank')}
              >
                <Github className="mr-3 h-5 w-5" />
                View on GitHub
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-8">
              <div className="flex items-center space-x-2 text-purple-200">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">No credit card required</span>
              </div>
              <div className="flex items-center space-x-2 text-purple-200">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">Free for open source</span>
              </div>
              <div className="flex items-center space-x-2 text-purple-200">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}; 