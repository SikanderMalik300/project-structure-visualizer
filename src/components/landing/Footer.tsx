'use client';

import { 
  Heart,
  FolderTree
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-8 left-8 w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full filter blur-2xl"></div>
        <div className="absolute bottom-8 right-8 w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full filter blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main footer content */}
        <div className="py-8 sm:py-12 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Brand section */}
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                <FolderTree className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                Project Structure Visualizer
              </h3>
            </div>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 max-w-md">
              The simplest way to understand and document your project structure. 
              Transform complex codebases into beautiful, shareable visualizations.
            </p>
          </div>

          {/* Contact/Info section */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4">Get Started</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <span className="text-slate-400 text-xs sm:text-sm">
                  Upload your project ZIP file and visualize your structure instantly
                </span>
              </li>
              <li>
                <span className="text-slate-400 text-xs sm:text-sm">
                  No signup required • Free forever • Privacy guaranteed
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="py-4 sm:py-6 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            {/* Copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-slate-400 text-xs sm:text-sm">
              <span>© {currentYear} Project Structure Visualizer</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> for developers
              </span>
            </div>

            {/* Simple status */}
            <div className="text-xs sm:text-sm text-slate-400">
              <span>Free & Open Source</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}