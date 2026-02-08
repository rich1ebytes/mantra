import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Sparkles } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 mt-20">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <span className="text-white font-display font-bold">M</span>
              </div>
              <span className="font-display font-bold text-2xl text-white">Mantra</span>
            </div>
            <p className="text-sm leading-relaxed max-w-md text-slate-400 mb-6">
              News from every origin. Choose where your stories come from,
              or publish your own. Powered by AI for personalized discovery.
            </p>
            <div className="flex items-center gap-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/20">
                <Sparkles className="w-3 h-3" />
                AI Powered
              </span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Platform</h4>
            <div className="space-y-3 text-sm">
              <Link to="/" className="block text-slate-400 hover:text-white transition-colors duration-200">
                Home
              </Link>
              <Link to="/search" className="block text-slate-400 hover:text-white transition-colors duration-200">
                Explore
              </Link>
              <Link to="/write" className="block text-slate-400 hover:text-white transition-colors duration-200">
                Write
              </Link>
              <Link to="/chat" className="block text-slate-400 hover:text-white transition-colors duration-200">
                AI Assistant
              </Link>
            </div>
          </div>

          <div>
            <div className="space-y-3 text-sm">
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              © {currentYear} Mantra
            </p>
            <div className="flex items-center gap-4">
             <p className="text-slate-300">Richard Gomes</p>

              <a href="https://github.com/rich1ebytes/mantra/" className="text-slate-500 hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
                           

              <a href="https://www.linkedin.com/in/richard-gomes-858764276/" className="text-slate-500 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
