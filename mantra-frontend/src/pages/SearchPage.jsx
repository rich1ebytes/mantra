import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, X, Filter } from "lucide-react";
import ArticleCard from "../components/articles/ArticleCard";
import Loader from "../components/common/Loader";
import { useSearch } from "../hooks/useData";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState("all");

  const { data, isLoading } = useSearch(searchTerm);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
    setSearchTerm(q);
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchTerm(query.trim());
      setSearchParams({ q: query.trim() });
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSearchTerm("");
    setSearchParams({});
  };

  const articles = data?.articles || [];

  // Simulated filters for UI demonstration
  const filters = [
    { id: "all", label: "All Results" },
    { id: "latest", label: "Latest" },
    { id: "popular", label: "Popular" },
    { id: "ai", label: "AI Curated" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[80vh]">
      {/* Search Header */}
      <div className="max-w-3xl mx-auto mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-500/10">
            <Search className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="font-display text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Discover Stories
          </h1>
          <p className="text-slate-500 mb-8 max-w-lg mx-auto">
            Search millions of articles from thousands of trusted sources worldwide.
          </p>

          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-white rounded-2xl shadow-lg shadow-slate-200/50 hover:shadow-xl transition-shadow duration-300 border border-slate-100">
              <Search className="absolute left-5 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles, topics, origins..."
                className="w-full pl-14 pr-12 py-4 bg-transparent border-none rounded-2xl text-lg 
                           focus:outline-none focus:ring-0 placeholder:text-slate-400 text-slate-900"
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {searchTerm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 pb-4 border-b border-slate-100">
              <p className="text-slate-500 font-medium">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                    Searching...
                  </span>
                ) : (
                  <>Found <span className="text-slate-900 font-bold">{data?.total || 0}</span> results for "<span className="text-slate-900">{searchTerm}</span>"</>
                )}
              </p>

              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl">
                {filters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeFilter === filter.id
                        ? "bg-white text-orange-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
                      }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 h-96 skeleton opacity-50" />
                ))}
              </div>
            ) : articles.length > 0 ? (
              <motion.div
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } }
                }}
              >
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-24 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No articles found</h3>
                <p className="text-slate-500">
                  We couldn't find anything matches "{searchTerm}".<br />
                  Try searching for different keywords or topics.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!searchTerm && (
        <div className="text-center py-20 opacity-50">
          <Sparkles className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400">Start typing to search globally</p>
        </div>
      )}
    </div>
  );
}
