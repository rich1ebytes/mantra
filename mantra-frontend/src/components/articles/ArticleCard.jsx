import { Link } from "react-router-dom";
import { Clock, Eye, Bookmark } from "lucide-react";
import { timeAgo, truncate } from "../../utils/helpers";

export default function ArticleCard({ article, variant = "default" }) {
  const {
    title, slug, summary, thumbnail, readingTime,
    viewsCount, publishedAt, author, origin, category,
  } = article;

  if (variant === "featured") {
    return (
      <Link to={`/article/${slug}`} className="group block">
        <div className="card overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="aspect-[16/10] md:aspect-auto bg-ink-100 overflow-hidden">
              {thumbnail ? (
                <img src={thumbnail} alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-mantra-100 to-mantra-200 flex items-center justify-center">
                  <span className="font-display text-4xl text-mantra-400">{origin?.flag || "📰"}</span>
                </div>
              )}
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                {origin && <span className="badge-origin">{origin.flag} {origin.name}</span>}
                {category && <span className="badge">{category.icon} {category.name}</span>}
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-ink-950 mb-3 
                             group-hover:text-mantra-700 transition-colors leading-tight">
                {title}
              </h2>
              <p className="text-ink-600 text-sm leading-relaxed mb-4">
                {truncate(summary, 200)}
              </p>
              <div className="flex items-center gap-4 text-xs text-ink-400">
                <span className="font-medium text-ink-700">{author?.displayName || author?.username}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {readingTime} min</span>
                <span>{timeAgo(publishedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/article/${slug}`} className="group block">
      <div className="card overflow-hidden h-full flex flex-col">
        <div className="aspect-[16/10] bg-ink-100 overflow-hidden">
          {thumbnail ? (
            <img src={thumbnail} alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-mantra-50 to-mantra-100 flex items-center justify-center">
              <span className="text-3xl">{origin?.flag || "📰"}</span>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2">
            {origin && <span className="badge-origin text-[11px]">{origin.flag} {origin.name}</span>}
            {category && <span className="badge text-[11px]">{category.name}</span>}
          </div>
          <h3 className="font-display font-bold text-lg text-ink-950 mb-2 leading-snug
                         group-hover:text-mantra-700 transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-ink-500 text-sm leading-relaxed mb-3 line-clamp-2 flex-1">
            {truncate(summary, 120)}
          </p>
          <div className="flex items-center justify-between text-xs text-ink-400 pt-2 border-t border-ink-50">
            <span className="font-medium text-ink-600">{author?.displayName || author?.username}</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {readingTime}m</span>
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {viewsCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
