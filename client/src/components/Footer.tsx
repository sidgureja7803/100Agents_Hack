import { Github, ExternalLink, Heart } from 'lucide-react';

export const Footer = () => {
  const links = [
    {
      name: 'GitHub',
      url: 'https://github.com',
      icon: Github,
      description: 'Source code hosting'
    },
    {
      name: 'Appwrite',
      url: 'https://appwrite.io',
      icon: ExternalLink,
      description: 'Backend as a Service'
    },
    {
      name: 'Tavily',
      url: 'https://tavily.com',
      icon: ExternalLink,
      description: 'AI Search API'
    },
    {
      name: 'Mem0',
      url: 'https://mem0.ai',
      icon: ExternalLink,
      description: 'Memory for AI'
    }
  ];

  return (
    <footer className="mt-24 border-t border-slate-200 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900">DevPilotAI</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Streamline your DevOps workflow with AI-powered automation. 
              Generate production-ready CI/CD pipelines in seconds.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>for developers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">API Reference</a></li>
              <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">Examples</a></li>
              <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">Blog</a></li>
              <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">Tutorials</a></li>
              <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">Best Practices</a></li>
              <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">Community</a></li>
            </ul>
          </div>

          {/* Powered By */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Powered By</h4>
            <div className="grid grid-cols-2 gap-3">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group"
                    title={link.description}
                  >
                    <Icon className="h-4 w-4 text-slate-600 group-hover:text-blue-600 transition-colors" />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors">
                      {link.name}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © 2024 DevPilotAI. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};