import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, ArrowRight, Sparkles, Zap } from "lucide-react";
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="mb-12 relative">
        {/* Decorative elements */}
        <div className="absolute -top-10 right-20 w-40 h-40 bg-gradient-to-br from-orange-200/30 to-amber-100/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-32 -left-20 w-56 h-56 bg-gradient-to-br from-orange-100/20 to-yellow-100/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-xs font-medium mb-4 border border-orange-100"
            >
              <Zap className="w-3 h-3" />
              AI-Curated Daily
            </motion.div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
              <span className="gradient-text">Today's Stories</span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-slate-500 mt-2 text-base"
            >
              News from every origin, curated for you.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to="/chat" className="btn-primary hidden sm:inline-flex shadow-xl shadow-orange-500/20">
              <Sparkles className="w-4 h-4" /> Get AI Briefing
            </Link>
          </motion.div>
        </motion.div>

        {/* Featured + Sidebar */}
        {trendingLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader size="lg" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {featured && <ArticleCard article={featured} variant="featured" />}
            </div>
            <motion.div
              className="space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Trending Now</h3>
              </div>
              <div className="card-static divide-y divide-slate-100 overflow-hidden">
                {sidebarTrending.map((article, i) => (
                  <motion.div key={article.id} variants={itemVariants}>
                    <Link
                      to={`/article/${article.slug}`}
                      className="flex gap-4 p-4 group hover:bg-slate-50 transition-colors duration-200"
                    >
                      <span className="text-3xl font-display font-bold text-slate-200 group-hover:text-orange-400 transition-colors w-8 shrink-0">
                        {String(i + 2).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1.5">
                          {article.origin?.flag} {article.origin?.name} · {article.readingTime}m read
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-12" />

      {/* Origin Filter + Article Grid */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4"
        >
          <div>
            <h2 className="section-header">Latest Articles</h2>
            <p className="section-subheader">Fresh stories from around the world</p>
          </div>
        </motion.div>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <OriginFilter selected={selectedOrigin} onChange={setSelectedOrigin} />
        </motion.div>

        {articlesLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader size="lg" />
          </div>
        ) : articles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24"
          >
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-500 text-lg font-medium">No articles found</p>
            <p className="text-slate-400 text-sm mt-1">Try selecting a different origin</p>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
