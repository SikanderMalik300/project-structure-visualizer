'use client';

import { Button } from '@/components/ui/button';
import { 
  Upload, 
  Zap,
  Download
} from 'lucide-react';

interface HowItWorksProps {
  onGetStarted: () => void;
}

export function HowItWorks({ onGetStarted }: HowItWorksProps) {
  const steps = [
    {
      step: "01",
      title: "Upload Your ZIP",
      description: "Simply drag and drop or select any project ZIP file from your computer. Our tool supports all project types.",
      icon: Upload,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      details: ["Drag & drop interface", "Multiple file formats", "Large file support"]
    },
    {
      step: "02", 
      title: "Instant Analysis",
      description: "Our powerful engine processes your project structure in real-time. Watch as your files are organized beautifully.",
      icon: Zap,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      details: ["Real-time processing", "Smart organization", "Visual hierarchy"]
    },
    {
      step: "03",
      title: "Export & Share",
      description: "Download the clean, formatted structure as a text file. Perfect for documentation, README files, and team sharing.",
      icon: Download,
      gradient: "from-green-500 to-emerald-500", 
      bgGradient: "from-green-50 to-emerald-50",
      details: ["Multiple export formats", "Ready for documentation", "Easy sharing"]
    }
  ];

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-5 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-10 w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
        <div className="absolute bottom-1/4 left-1/4 w-4 h-4 bg-indigo-500 transform rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text text-xs sm:text-sm font-semibold mb-2 sm:mb-3">
            SIMPLE PROCESS
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-2 sm:mb-3 leading-tight">
            How It 
            <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text"> Works</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Three simple steps to visualize any project structure in seconds
          </p>
        </div>
        
        {/* Steps */}
        <div className="max-w-4xl mx-auto">
          {/* Connected flow design */}
          <div className="relative">
            {/* Background connecting path */}
            <div className="hidden lg:block absolute top-8 left-0 right-0 h-0.5">
              <div className="w-full h-full bg-gradient-to-r from-blue-200 via-purple-200 via-pink-200 to-green-200 rounded-full opacity-30"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 via-pink-400 to-green-400 rounded-full animate-pulse opacity-50"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative group">
                  {/* Step card */}
                  <div className="relative z-10">
                    {/* Step number with enhanced design */}
                    <div className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl mx-auto mb-4 sm:mb-6 text-lg sm:text-xl font-bold text-white shadow-lg bg-gradient-to-r ${step.gradient} group-hover:scale-110 transition-all duration-300 relative`}>
                      {step.step}
                      {/* Glowing ring effect */}
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${step.gradient} opacity-30 group-hover:opacity-50 transition-opacity duration-300 animate-pulse`}></div>
                      <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r ${step.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    </div>
                    
                    {/* Content card with enhanced styling */}
                    <div className={`bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-1 border border-slate-100 overflow-hidden relative`}>
                      {/* Background gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${step.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      
                      {/* Decorative corner elements */}
                      <div className={`absolute top-2 right-2 w-2 h-2 rounded-full bg-gradient-to-r ${step.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
                      <div className={`absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${step.gradient} opacity-30 group-hover:opacity-60 transition-opacity duration-300`}></div>
                      
                      {/* Content */}
                      <div className="relative z-10">
                        {/* Icon */}
                        <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg mb-3 sm:mb-4 bg-gradient-to-r ${step.gradient} shadow-md mx-auto group-hover:rotate-12 transition-transform duration-300`}>
                          <step.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-2 sm:mb-3 text-center group-hover:text-slate-900 transition-colors duration-300">
                          {step.title}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-center mb-3 sm:mb-4 group-hover:text-slate-700 transition-colors duration-300">
                          {step.description}
                        </p>
                        
                        {/* Enhanced details with better styling */}
                        <div className="space-y-1.5 sm:space-y-2">
                          {step.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="flex items-center justify-center text-xs text-slate-500 group-hover:text-slate-600 transition-colors duration-300">
                              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${step.gradient} mr-2 flex-shrink-0 group-hover:scale-125 transition-transform duration-300`}></div>
                              <span className="font-medium">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8 sm:mt-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-slate-200 max-w-lg mx-auto">
            <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2 sm:mb-3">
              Ready to get started?
            </h3>
            <p className="text-sm text-slate-600 mb-3 sm:mb-4">
              Try our tool now and see your project structure come to life
            </p>
            <Button 
              size="lg"
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 text-sm sm:text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Upload className="w-4 h-4 mr-2" />
              Start Visualizing Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}