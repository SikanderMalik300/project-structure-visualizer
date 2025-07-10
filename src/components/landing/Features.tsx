'use client';

import { Card, CardContent } from '@/components/ui/card';
import { 
  FolderTree,
  Zap,
  Shield,
  Download,
  FileText,
  Users,
  Code,
  Globe,
  Lock
} from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: FolderTree,
      title: "Beautiful Tree Visualization",
      description: "Get a clean, hierarchical view of your entire project structure with intuitive folder and file icons.",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      icon: Zap,
      title: "Lightning Fast Processing",
      description: "Process even large projects in seconds. Our optimized parser handles complex directory structures effortlessly.",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50"
    },
    {
      icon: Download,
      title: "Export Ready Files",
      description: "Download your project structure as a formatted text file, perfect for documentation and sharing with teams.",
      gradient: "from-indigo-500 to-blue-500",
      bgGradient: "from-indigo-50 to-blue-50"
    },
    {
      icon: Shield,
      title: "Privacy First Approach",
      description: "All processing happens in your browser. Your files never leave your device - complete privacy guaranteed.",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50"
    },
    {
      icon: Code,
      title: "Universal Compatibility",
      description: "Support for any project type - React, Node.js, Python, Java, PHP, and more. Works with any ZIP file format.",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Perfect for code reviews, onboarding new team members, and creating comprehensive project documentation.",
      gradient: "from-teal-500 to-cyan-500",
      bgGradient: "from-teal-50 to-cyan-50"
    }
  ];

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-16 right-16 w-48 h-48 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-16 left-16 w-48 h-48 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text text-sm font-semibold mb-3">
            POWERFUL FEATURES
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 leading-tight">
            Why Choose Our
            <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text"> Tool?</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Built for developers who value <span className="text-blue-600 font-semibold">simplicity</span>, 
            <span className="text-purple-600 font-semibold"> speed</span>, and 
            <span className="text-indigo-600 font-semibold"> reliability</span>
          </p>
        </div>
        
        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 bg-white overflow-hidden"
            >
              <CardContent className="p-6 relative">
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-gradient-to-r ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-slate-900 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-3 right-3 w-8 h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-3 left-3 w-6 h-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-base text-slate-600 mb-4">
            Join thousands of developers who trust our tool
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              <span>Global Community</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-green-500" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Lightning Fast</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}