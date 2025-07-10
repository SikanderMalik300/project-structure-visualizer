'use client';

import { Button } from '@/components/ui/button';
import { 
  Upload, 
  Github,
  Sparkles,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
  onViewDemo: () => void;
}

export function Hero({ onGetStarted, onViewDemo }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 sm:py-16 lg:py-20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20 sm:opacity-30">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl animate-pulse"></div>
        <div className="absolute top-20 sm:top-40 right-5 sm:right-10 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-4 sm:-bottom-8 left-1/2 transform -translate-x-1/2 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl animate-pulse animation-delay-4000"></div>
      </div>
      
      {/* Geometric patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-16 sm:top-32 left-1/4 w-4 sm:w-6 lg:w-8 h-4 sm:h-6 lg:h-8 border-2 border-blue-500 rotate-45 animate-bounce"></div>
        <div className="absolute top-24 sm:top-48 right-1/4 w-3 sm:w-4 lg:w-6 h-3 sm:h-4 lg:h-6 bg-indigo-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-16 sm:bottom-32 left-1/3 w-2 sm:w-3 lg:w-4 h-2 sm:h-3 lg:h-4 bg-cyan-500 transform rotate-45 animate-spin-slow"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl lg:max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-blue-700 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 lg:mb-8 border border-blue-100 shadow-lg animate-fade-in">
            <Sparkles className="w-3 h-3 sm:w-4 lg:w-5 sm:h-4 lg:h-5 text-blue-500" />
            <span>Transform Your Project Analysis</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
          </div>
          
          {/* Main heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 lg:mb-8 animate-fade-in-up">
            <span className="text-slate-800 leading-tight">Visualize Your</span>
            <br />
            <span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text leading-tight">
              Project Structure
            </span>
            <br />
            <span className="text-slate-700 leading-tight">Instantly</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-slate-600 mb-6 sm:mb-8 lg:mb-12 leading-relaxed max-w-2xl lg:max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            Upload any project ZIP file and get a beautiful, downloadable tree structure. 
            Perfect for <span className="text-blue-600 font-semibold">documentation</span>, 
            <span className="text-purple-600 font-semibold"> code reviews</span>, and 
            <span className="text-indigo-600 font-semibold"> project onboarding</span>.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center items-center mb-8 sm:mb-12 lg:mb-16 animate-fade-in-up animation-delay-400">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-6 text-sm sm:text-base lg:text-xl font-semibold rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-0"
              onClick={onGetStarted}
            >
              <Upload className="w-4 h-4 sm:w-5 lg:w-6 sm:h-5 lg:h-6 mr-2 sm:mr-3" />
              Start Free
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="animate-fade-in-up animation-delay-600">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-8 text-xs sm:text-sm text-slate-500 bg-white/60 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full shadow-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 sm:w-4 lg:w-5 sm:h-4 lg:h-5 text-green-500" />
                <span className="font-medium">No signup required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 sm:w-4 lg:w-5 sm:h-4 lg:h-5 text-green-500" />
                <span className="font-medium">Instant results</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 sm:w-4 lg:w-5 sm:h-4 lg:h-5 text-green-500" />
                <span className="font-medium">Free forever</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" className="w-full h-12 sm:h-16 lg:h-20 fill-white">
          <path d="M0,60 C300,90 900,30 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  );
}