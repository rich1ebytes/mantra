import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Eye, TrendingUp, Sparkles } from "lucide-react";
import { timeAgo, truncate } from "../../utils/helpers";

export default function ArticleCard({ article, variant = "default", index = 0 }) {
  const {
    title, slug, summary, thumbnail, readingTime,
    viewsCount, publishedAt, author, origin, category,
  } = article;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.21, 0.47, 0.32, 0.98]
      }
    }
  };

  const Badge = ({ children, className = "" }) => (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${className}`}>
      {children}
    </span>
  );

  if (variant === "featured") {
    return (
      <Link to={`/article/${slug}`} className="group block h-full">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="relative h-full min-h-[400px] rounded-3xl overflow-hidden shadow-xl shadow-slate-900/10 group-hover:shadow-2xl group-hover:shadow-orange-500/20 transition-all duration-500"
        >
          {/* Background Image */}
          <div className="absolute inset-0 bg-slate-200">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <Sparkles className="w-20 h-20 text-slate-700/50" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-orange-900/20 mix-blend-overlay" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 p-8 flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4 flex flex-wrap gap-2"
            >
              <Badge className="bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                <TrendingUp className="w-3 h-3 mr-1" /> Featured
              </Badge>
              {origin && (
                <Badge className="bg-white/10 text-orange-200 backdrop-blur-md border border-white/10">
                  {origin.flag} {origin.name}
                </Badge>
              )}
            </motion.div>

            <h2 className="font-display text-4xl font-bold text-white mb-4 leading-tight drop-shadow-sm group-hover:text-orange-200 transition-colors duration-300">
              {title}
            </h2>

            <p className="text-slate-200 text-lg mb-6 line-clamp-2 max-w-2xl leading-relaxed text-balance">
              {truncate(summary, 200)}
            </p>

            <div className="flex items-center gap-4 text-xs font-medium text-slate-300 border-t border-white/10 pt-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                  {(author?.displayName || author?.username || "?")[0].toUpperCase()}
                </div>
                <span className="text-white tracking-wide">{author?.displayName || author?.username}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {readingTime} min read</span>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <span>{timeAgo(publishedAt)}</span>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link to={`/article/${slug}`} className="group block h-full">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        whileHover={{ y: -4 }}
        className="flex flex-col h-full bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden"
      >
        {/* Image */}
        <div className="aspect-[16/9] relative overflow-hidden bg-slate-100">
          {thumbnail ? (
            <>
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors duration-300" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center border-b border-slate-50">
              <span className="text-3xl filter grayscale opacity-50">{origin?.flag || "📰"}</span>
            </div>
          )}

          <div className="absolute top-3 left-3 flex gap-2">
            {origin && (
              <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-sm border border-slate-200/50">
                {origin.name}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col">
          <div className="flex-1">
            <h3 className="font-display font-bold text-lg text-slate-900 mb-2 leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors duration-200">
              {title}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4">
              {truncate(summary, 110)}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">
                {author?.displayName || author?.username}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {readingTime}m</span>
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {viewsCount}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
