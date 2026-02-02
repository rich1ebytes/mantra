import { useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, ArrowRight } from "lucide-react";
import ArticleCard from "../components/articles/ArticleCard";
import OriginFilter from "../components/articles/OriginFilter";
import Loader from "../components/common/Loader";
import { useArticles, useTrending } from "../hooks/useData";

export default function Home() {
  const [selectedOrigin, setSelectedOrigin] = useState(null);

  const { data: trending, isLoading: trendingLoading } = useTrending(5);
  const { data: articlesData, isLoading: articlesLoading } = useArticles({
    originId: selectedOrigin,
    page: 1,
    limit: 12,
  });

  const articles = articlesData?.articles || [];
  const featured = trending?.[0];
  const sidebarTrending = trending?.slice(1, 5) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero Section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink-950">
              Today's Stories
            </h1>
            <p className="text-ink-500 mt-1">News from every origin, curated for you.</p>
          </div>
          <Link to="/chat" className="btn-primary hidden sm:flex">
            <TrendingUp className="w-4 h-4" /> AI Briefing
          </Link>
        </div>

        {/* Featured + Sidebar */}
        {trendingLoading ? (
          <Loader className="py-20" size="lg" />
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {featured && <ArticleCard article={featured} variant="featured" />}
            </div>
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-semibold text-sm text-ink-500 uppercase tracking-wider">
                <TrendingUp className="w-4 h-4 text-mantra-500" /> Trending
              </h3>
              {sidebarTrending.map((article, i) => (
                <Link
                  key={article.id}
                  to={`/article/${article.slug}`}
                  className="flex gap-3 group"
                >
                  <span className="text-2xl font-display font-bold text-ink-200 group-hover:text-mantra-400 transition-colors">
                    {String(i + 2).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-ink-900 group-hover:text-mantra-700 transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h4>
                    <p className="text-xs text-ink-400 mt-1">
                      {article.origin?.flag} {article.origin?.name} · {article.readingTime}m read
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Origin Filter + Article Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl font-bold text-ink-950">Latest Articles</h2>
        </div>

        <div className="mb-6">
          <OriginFilter selected={selectedOrigin} onChange={setSelectedOrigin} />
        </div>

        {articlesLoading ? (
          <Loader className="py-20" size="lg" />
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-ink-400 text-lg">No articles found</p>
            <p className="text-ink-300 text-sm mt-1">Try selecting a different origin</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
