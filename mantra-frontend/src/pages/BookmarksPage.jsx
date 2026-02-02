import { Bookmark } from "lucide-react";
import ArticleCard from "../components/articles/ArticleCard";
import Loader from "../components/common/Loader";
import { useBookmarks } from "../hooks/useData";

export default function BookmarksPage() {
  const { data: bookmarks, isLoading } = useBookmarks();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Bookmark className="w-6 h-6 text-mantra-600" />
        <h1 className="font-display text-3xl font-bold text-ink-950">Bookmarks</h1>
      </div>

      {isLoading ? (
        <Loader className="py-20" size="lg" />
      ) : !bookmarks?.length ? (
        <div className="text-center py-20">
          <Bookmark className="w-12 h-12 text-ink-200 mx-auto mb-4" />
          <p className="text-ink-400 text-lg">No bookmarks yet</p>
          <p className="text-ink-300 text-sm mt-1">Save articles to read later</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((b) => (
            <ArticleCard key={b.id} article={b.article} />
          ))}
        </div>
      )}
    </div>
  );
}
