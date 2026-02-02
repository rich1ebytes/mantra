import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-ink-950 text-ink-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-mantra-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">M</span>
              </div>
              <span className="font-display font-bold text-xl text-white">Mantra</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              News from every origin. Choose where your stories come from, 
              or publish your own. Powered by AI for personalized discovery.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Platform</h4>
            <div className="space-y-2 text-sm">
              <Link to="/" className="block hover:text-white transition-colors">Home</Link>
              <Link to="/search" className="block hover:text-white transition-colors">Explore</Link>
              <Link to="/write" className="block hover:text-white transition-colors">Write</Link>
              <Link to="/chat" className="block hover:text-white transition-colors">AI Assistant</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Team</h4>
            <div className="space-y-2 text-sm">
              <p>Richard Gomes</p>
              <p>Mohammed Anas Irfan</p>
              <p className="text-ink-500 pt-1">Guide: Jalaj Pandey</p>
            </div>
          </div>
        </div>
        <div className="border-t border-ink-800 mt-10 pt-6 text-center text-xs text-ink-500">
          © {new Date().getFullYear()} Mantra. Built with PERN Stack + AI.
        </div>
      </div>
    </footer>
  );
}
