import { useParams, Link } from "react-router-dom";
import { Clock, Eye, Bookmark, BookmarkCheck, ArrowLeft, Share2 } from "lucide-react";
import { useArticle } from "../hooks/useData";
import { useAuth } from "../context/AuthContext";
import { bookmarkAPI } from "../services/articleService";
import { useState, useEffect } from "react";
import { formatDate } from "../utils/helpers";
import { PageLoader } from "../components/common/Loader";

export default function ArticlePage() {
  const { slug } = useParams();
  const { data: article, isLoading, error } = useArticle(slug);
  const { isAuthenticated } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (article && isAuthenticated) {
      bookmarkAPI.check(article.id)
        .then(({ data }) => setBookmarked(data.bookmarked))
        .catch(() => {});
    }
  }, [article, isAuthenticated]);

  const toggleBookmark = async () => {
    if (!article) return;
    try {
      if (bookmarked) {
        await bookmarkAPI.remove(article.id);
      } else {
        await bookmarkAPI.add(article.id);
      }
      setBookmarked(!bookmarked);
    } catch {}
  };

  if (isLoading) return <PageLoader />;
  if (error || !article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-display font-bold text-ink-950 mb-2">Article not found</h1>
        <Link to="/" className="text-mantra-600 hover:underline">← Back to home</Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-mantra-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      {/* Meta */}
      <div className="flex items-center gap-2 mb-4">
        {article.origin && <span className="badge-origin">{article.origin.flag} {article.origin.name}</span>}
        {article.category && <span className="badge">{article.category.icon} {article.category.name}</span>}
      </div>

      {/* Title */}
      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-950 leading-tight mb-4">
        {article.title}
      </h1>

      {/* Summary */}
      <p className="text-lg text-ink-600 leading-relaxed mb-6">
        {article.summary}
      </p>

      {/* Author & Meta Bar */}
      <div className="flex items-center justify-between py-4 border-y border-ink-100 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-mantra-100 rounded-full flex items-center justify-center font-bold text-mantra-700">
            {(article.author?.displayName || article.author?.username || "?")[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-sm text-ink-900">
              {article.author?.displayName || article.author?.username}
            </p>
            <p className="text-xs text-ink-400">
              {formatDate(article.publishedAt || article.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-ink-400">
            <Clock className="w-3.5 h-3.5" /> {article.readingTime} min
          </span>
          <span className="flex items-center gap-1 text-xs text-ink-400">
            <Eye className="w-3.5 h-3.5" /> {article.viewsCount}
          </span>
          {isAuthenticated && (
            <button onClick={toggleBookmark} className="btn-ghost p-2">
              {bookmarked
                ? <BookmarkCheck className="w-5 h-5 text-mantra-600" />
                : <Bookmark className="w-5 h-5" />
              }
            </button>
          )}
        </div>
      </div>

      {/* Thumbnail */}
      {article.thumbnail && (
        <img
          src={article.thumbnail}
          alt={article.title}
          className="w-full rounded-xl mb-8 shadow-sm"
        />
      )}

      {/* Content */}
      <div
        className="prose-article"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Tags */}
      {article.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-ink-100">
          {article.tags.map((tag) => (
            <Link
              key={tag}
              to={`/search?q=${encodeURIComponent(tag)}`}
              className="badge hover:bg-mantra-50 hover:text-mantra-700 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
