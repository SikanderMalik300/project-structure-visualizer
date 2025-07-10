'use client';

import { Button } from '@/components/ui/button';
import { 
  Upload, 
  ArrowRight,
  Star,
  Users,
  Zap,
  Heart
} from 'lucide-react';

interface CTAProps {
  onGetStarted: () => void;
  onViewDemo: () => void;
}

export function CTA({ onGetStarted, onViewDemo }: CTAProps) {
  const stats = [
    { icon: Users, value: "10K+", label: "Developers" },
    { icon: Zap, value: "1M+", label: "Files Processed" },
    { icon: Star, value: "4.9", label: "Rating" },
    { icon: Heart, value: "100%", label: "Free" }
  ];

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-5 left-5 w-24 h-24 bg-white rounded-full mix-blend-overlay filter blur-xl animate-pulse"></div>
        <div className="absolute top-20 right-10 w-32 h-32 bg-cyan-300 rounded-full mix-blend-overlay filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-28 h-28 bg-pink-300 rounded-full mix-blend-overlay filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Geometric patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-8 left-1/4 w-2 h-2 border-2 border-white rotate-45 animate-spin-slow"></div>
        <div className="absolute top-12 right-1/3 w-3 h-3 bg-white rounded-full animate-bounce"></div>
        <div className="absolute bottom-8 left-1/5 w-4 h-4 border-2 border-cyan-300 rounded-full animate-pulse"></div>
        <div className="absolute bottom-12 right-1/4 w-1.5 h-1.5 bg-pink-300 transform rotate-45 animate-ping"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Main content */}
        <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 border border-white/30">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
            <span>Trusted by thousands of developers</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
            Ready to Visualize
            <br />
            <span className="text-transparent bg-gradient-to-r from-cyan-200 to-pink-200 bg-clip-text">
              Your Projects?
            </span>
          </h2>
          
          {/* Subtitle */}
          <p className="text-sm sm:text-base text-blue-100 mb-6 sm:mb-8 leading-relaxed max-w-lg mx-auto">
            Join thousands of developers who trust our tool for project structure analysis. 
            Start visualizing today - <span className="text-cyan-200 font-semibold">completely free!</span>
          </p>
          
          {/* CTA Button */}
          <div className="mb-8 sm:mb-12">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
              onClick={onGetStarted}
            >
              <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Get Started Now
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
            >
              <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-lg mb-2 mx-auto group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-white mb-1 group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-blue-200 text-xs font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom message */}
        <div className="max-w-lg mx-auto">
          <p className="text-blue-200 text-sm">
            No credit card required • No hidden fees • Start instantly
          </p>
        </div>
      </div>
    </section>
  );
}