import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import ArticleCard from "../components/articles/ArticleCard";
import Loader from "../components/common/Loader";
import { useSearch } from "../hooks/useData";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [searchTerm, setSearchTerm] = useState(initialQuery);

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

  const articles = data?.articles || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="max-w-2xl mx-auto mb-10">
        <h1 className="font-display text-3xl font-bold text-ink-950 text-center mb-6">
          Search News
        </h1>
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, topics, origins..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-ink-200 rounded-xl text-base
                       focus:outline-none focus:ring-2 focus:ring-mantra-500/30 focus:border-mantra-500
                       shadow-sm"
          />
        </form>
      </div>

      {searchTerm && (
        <p className="text-sm text-ink-500 mb-6">
          {isLoading
            ? "Searching..."
            : `${data?.total || 0} results for "${searchTerm}"`}
        </p>
      )}

      {isLoading ? (
        <Loader className="py-20" size="lg" />
      ) : articles.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : searchTerm ? (
        <div className="text-center py-20">
          <p className="text-ink-400 text-lg">No articles found</p>
          <p className="text-ink-300 text-sm mt-1">Try a different search term</p>
        </div>
      ) : null}
    </div>
  );
}
