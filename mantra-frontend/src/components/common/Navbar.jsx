import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, PenSquare, Bookmark, MessageCircle, Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-ink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-mantra-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">M</span>
            </div>
            <span className="font-display font-bold text-xl text-ink-950 hidden sm:block">
              Mantra
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-ink-50 border-none rounded-full text-sm
                           focus:outline-none focus:ring-2 focus:ring-mantra-500/30 focus:bg-white
                           transition-all"
              />
            </div>
          </form>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <Link to="/write" className="btn-ghost">
                  <PenSquare className="w-4 h-4" /> Write
                </Link>
                <Link to="/bookmarks" className="btn-ghost">
                  <Bookmark className="w-4 h-4" />
                </Link>
                <Link to="/chat" className="btn-ghost">
                  <MessageCircle className="w-4 h-4" />
                </Link>
                <div className="w-px h-6 bg-ink-200 mx-1" />
                <Link to="/profile" className="btn-ghost">
                  <User className="w-4 h-4" />
                  <span className="max-w-[100px] truncate">{user?.displayName || user?.username}</span>
                </Link>
                <button onClick={logout} className="btn-ghost text-red-500 hover:bg-red-50">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">Log in</Link>
                <Link to="/register" className="btn-primary">Sign up</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden btn-ghost"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-ink-100 mt-2 pt-4 space-y-2">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </form>
            {isAuthenticated ? (
              <>
                <Link to="/write" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-ink-50 text-sm">
                  <PenSquare className="w-4 h-4" /> Write Article
                </Link>
                <Link to="/bookmarks" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-ink-50 text-sm">
                  <Bookmark className="w-4 h-4" /> Bookmarks
                </Link>
                <Link to="/chat" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-ink-50 text-sm">
                  <MessageCircle className="w-4 h-4" /> AI Chat
                </Link>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-ink-50 text-sm">
                  <User className="w-4 h-4" /> Profile
                </Link>
                <button onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 text-sm w-full">
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary flex-1 justify-center">Log in</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 justify-center">Sign up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
