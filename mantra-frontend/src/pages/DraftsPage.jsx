import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Send, Trash2, Clock, AlertCircle, PenSquare, ArrowLeft } from "lucide-react";
import api from "../services/api";

function StatusBadge({ status }) {
  const styles = {
    DRAFT: "bg-slate-50 text-slate-600 border-slate-200",
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
    PUBLISHED: "bg-green-50 text-green-700 border-green-200",
    REJECTED: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${styles[status] || styles.DRAFT}`}>
      {status}
    </span>
  );
}

export default function DraftsPage() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/articles/my/drafts");
      setArticles(res.data);
    } catch (err) {
      setError("Failed to load your articles.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (id) => {
    if (!confirm("Submit this article for review?")) return;
    try {
      await api.patch(`/articles/${id}`, { status: "PENDING" });
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "PENDING" } : a))
      );
    } catch (err) {
      alert(err.response?.data?.error || "Failed to submit article.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this article permanently?")) return;
    try {
      await api.delete(`/articles/${id}`);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete article.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-mantra-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-950">My Drafts</h1>
          <p className="text-sm text-ink-500 mt-1">Your saved drafts and pending submissions</p>
        </div>
        <Link to="/write" className="btn-primary">
          <PenSquare className="w-4 h-4" /> New Article
        </Link>
      </div>

      {error && (
        <div className="flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-6">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-3 border-mantra-200 border-t-mantra-600 rounded-full animate-spin" />
        </div>
      )}

      {!loading && articles.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-ink-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-ink-300" />
          </div>
          <p className="text-ink-500 font-medium">No drafts yet</p>
          <p className="text-sm text-ink-400 mt-1">Start writing and save a draft to see it here.</p>
          <Link to="/write" className="btn-primary mt-4 inline-flex">
            <PenSquare className="w-4 h-4" /> Write Article
          </Link>
        </div>
      )}

      {!loading && articles.length > 0 && (
        <div className="space-y-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white border border-ink-100 rounded-xl p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-4">
                {article.thumbnail ? (
                  <img src={article.thumbnail} alt="" className="w-24 h-16 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-24 h-16 rounded-lg bg-ink-50 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-ink-300" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-ink-900 text-sm line-clamp-1">{article.title}</h3>
                    <StatusBadge status={article.status} />
                  </div>
                  <p className="text-xs text-ink-500 line-clamp-1 mt-1">{article.summary}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-ink-400">
                    {article.origin && <span>{article.origin.flag} {article.origin.name}</span>}
                    {article.category && (
                      <>
                        <span>·</span>
                        <span>{article.category.icon} {article.category.name}</span>
                      </>
                    )}
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(article.updatedAt || article.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-ink-50">
                {article.status === "DRAFT" && (
                  <>
                    <button
                      onClick={() => handleSubmit(article.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-mantra-600 
                                 bg-mantra-50 hover:bg-mantra-100 rounded-lg transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" /> Submit for Review
                    </button>
                  </>
                )}
                {article.status === "REJECTED" && (
                  <span className="text-xs text-red-500">Rejected — edit and resubmit</span>
                )}
                {article.status === "PENDING" && (
                  <span className="text-xs text-yellow-600">Awaiting admin review</span>
                )}
                <div className="flex-1" />
                <button
                  onClick={() => handleDelete(article.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 
                             hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
