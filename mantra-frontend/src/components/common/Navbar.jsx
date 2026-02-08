import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, PenSquare, Bookmark, MessageCircle, Menu, X, LogOut, User, Sparkles, FileText, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();

  const isAdmin = user?.role === "ADMIN" || user?.role === "MODERATOR";

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <motion.div
              className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25"
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white font-display font-bold text-sm">M</span>
            </motion.div>
            <span className="font-display font-bold text-xl text-slate-900 hidden sm:block group-hover:text-orange-600 transition-colors">
              Mantra
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${searchFocused ? 'text-orange-500' : 'text-slate-400'}`} />
              <input
                type="text"
                placeholder="Search articles, topics, origins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50/80 border border-slate-200/60 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300 focus:bg-white
                           transition-all duration-300 placeholder:text-slate-400"
              />
            </div>
          </form>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/write" className="btn-ghost group">
                  <PenSquare className="w-4 h-4 group-hover:text-orange-500 transition-colors" />
                  <span className="group-hover:text-orange-600 transition-colors">Write</span>
                </Link>
                <Link to="/drafts" className="btn-ghost group">
                  <FileText className="w-4 h-4 group-hover:text-orange-500 transition-colors" />
                  <span className="group-hover:text-orange-600 transition-colors">Drafts</span>
                </Link>
                <Link to="/bookmarks" className="btn-ghost hover:bg-orange-50">
                  <Bookmark className="w-4 h-4" />
                </Link>
                <Link to="/chat" className="btn-ghost hover:bg-orange-50">
                  <MessageCircle className="w-4 h-4" />
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="btn-ghost hover:bg-orange-50 text-orange-600">
                    <Shield className="w-4 h-4" />
                  </Link>
                )}
                <div className="w-px h-6 bg-slate-200 mx-2" />
                <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 transition-all">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                    <span className="text-orange-700 font-semibold text-xs">
                      {(user?.displayName || user?.username || "?")[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="max-w-[100px] truncate text-sm font-medium text-slate-700">
                    {user?.displayName || user?.username}
                  </span>
                </Link>
                <motion.button
                  onClick={logout}
                  className="btn-ghost text-slate-400 hover:text-red-500 hover:bg-red-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium text-sm px-4 py-2 transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pb-4 pt-2 space-y-2">
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input-field pl-11"
                    />
                  </div>
                </form>
                {isAuthenticated ? (
                  <div className="space-y-1">
                    <Link to="/write" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-sm font-medium transition-colors">
                      <PenSquare className="w-4 h-4 text-slate-500" /> Write Article
                    </Link>
                    <Link to="/drafts" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-sm font-medium transition-colors">
                      <FileText className="w-4 h-4 text-slate-500" /> My Drafts
                    </Link>
                    <Link to="/bookmarks" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-sm font-medium transition-colors">
                      <Bookmark className="w-4 h-4 text-slate-500" /> Bookmarks
                    </Link>
                    <Link to="/chat" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-sm font-medium transition-colors">
                      <Sparkles className="w-4 h-4 text-slate-500" /> AI Chat
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 text-orange-600 text-sm font-medium transition-colors">
                        <Shield className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    <Link to="/profile" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-sm font-medium transition-colors">
                      <User className="w-4 h-4 text-slate-500" /> Profile
                    </Link>
                    <div className="divider-gradient my-2" />
                    <button onClick={() => { logout(); setMobileOpen(false); }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 text-sm font-medium w-full transition-colors">
                      <LogOut className="w-4 h-4" /> Log out
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3 pt-2">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary flex-1 justify-center">Log in</Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 justify-center">Get Started</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
