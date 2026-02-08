import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Clock, AlertCircle, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function StatusBadge({ status }) {
  const styles = {
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
    PUBLISHED: "bg-green-50 text-green-700 border-green-200",
    REJECTED: "bg-red-50 text-red-700 border-red-200",
    DRAFT: "bg-ink-50 text-ink-600 border-ink-200",
    ARCHIVED: "bg-ink-50 text-ink-500 border-ink-200",
  };

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${styles[status] || styles.DRAFT}`}>
      {status}
    </span>
  );
}

function ArticleCard({ article, onApprove, onReject, actionLoading }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-ink-100 rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
      <div className="flex gap-4 p-4">
        {article.thumbnail ? (
          <img src={article.thumbnail} alt="" className="w-28 h-20 rounded-lg object-cover shrink-0" />
        ) : (
          <div className="w-28 h-20 rounded-lg bg-ink-50 flex items-center justify-center shrink-0">
            <span className="text-2xl">{article.category?.icon || "📰"}</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-ink-900 line-clamp-2 text-sm leading-snug">{article.title}</h3>
            <StatusBadge status={article.status} />
          </div>
          <p className="text-xs text-ink-500 line-clamp-2 mt-1">{article.summary}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-ink-400">
            <span>By {article.author?.displayName || article.author?.username || "Unknown"}</span>
            {article.origin && (
              <>
                <span>·</span>
                <span>{article.origin.flag} {article.origin.name}</span>
              </>
            )}
            {article.category && (
              <>
                <span>·</span>
                <span>{article.category.icon} {article.category.name}</span>
              </>
            )}
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(article.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-2">
        <button onClick={() => setExpanded(!expanded)} className="text-xs text-mantra-600 hover:text-mantra-700 font-medium">
          {expanded ? "Hide content ▲" : "Preview content ▼"}
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4">
          <div
            className="prose-sm max-h-60 overflow-y-auto bg-ink-50 rounded-lg p-3 border border-ink-100 text-sm"
            dangerouslySetInnerHTML={{ __html: article.content || "<p>No content</p>" }}
          />
          {article.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {article.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 bg-ink-50 rounded-full text-ink-500">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {article.status === "PENDING" && (
        <div className="flex border-t border-ink-100">
          <button
            onClick={() => onApprove(article.id)}
            disabled={actionLoading === article.id}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium
                       text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" /> Approve
          </button>
          <div className="w-px bg-ink-100" />
          <button
            onClick={() => onReject(article.id)}
            disabled={actionLoading === article.id}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium
                       text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" /> Reject
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [tab, setTab] = useState("PENDING");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  // Wait for auth to load before checking role
  useEffect(() => {
    if (!authLoading && user && !["ADMIN", "MODERATOR"].includes(user.role)) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!authLoading && user && ["ADMIN", "MODERATOR"].includes(user.role)) {
      fetchArticles();
    }
  }, [tab, page, authLoading, user]);

  const fetchArticles = async () => {
    setLoading(true);
    setError("");
    try {
      let res;
      if (tab === "PENDING") {
        res = await api.get(`/articles/pending/review?page=${page}&limit=20`);
      } else {
        res = await api.get(`/articles?status=${tab}&page=${page}&limit=20`);
      }
      const data = res.data;
      setArticles(Array.isArray(data) ? data : data.articles || []);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Access denied. Admin or Moderator role required.");
      } else {
        setError("Failed to load articles.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!confirm("Approve and publish this article?")) return;
    setActionLoading(id);
    try {
      await api.patch(`/articles/${id}/status`, { status: "PUBLISHED" });
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to approve article.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (!confirm("Reject this article?")) return;
    setActionLoading(id);
    try {
      await api.patch(`/articles/${id}/status`, { status: "REJECTED" });
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to reject article.");
    } finally {
      setActionLoading(null);
    }
  };

  // Show loading while auth is resolving
  if (authLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-3 border-mantra-200 border-t-mantra-600 rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { key: "PENDING", label: "Pending Review", icon: Clock },
    { key: "PUBLISHED", label: "Published", icon: CheckCircle },
    { key: "REJECTED", label: "Rejected", icon: XCircle },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-mantra-100 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-mantra-600" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-950">Admin Dashboard</h1>
          <p className="text-sm text-ink-500">Review and moderate submitted articles</p>
        </div>
      </div>

      <div className="flex gap-1 bg-ink-50 p-1 rounded-xl mb-6">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { setTab(key); setPage(1); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg text-sm font-medium transition-all
              ${tab === key ? "bg-white text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-700"}`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
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
            {tab === "PENDING" ? <Clock className="w-8 h-8 text-ink-300" /> :
              tab === "PUBLISHED" ? <CheckCircle className="w-8 h-8 text-ink-300" /> :
                <XCircle className="w-8 h-8 text-ink-300" />}
          </div>
          <p className="text-ink-500 font-medium">
            {tab === "PENDING" ? "No articles pending review" :
              tab === "PUBLISHED" ? "No published articles" : "No rejected articles"}
          </p>
          {tab === "PENDING" && (
            <p className="text-sm text-ink-400 mt-1">New submissions will appear here for review.</p>
          )}
        </div>
      )}

      {!loading && articles.length > 0 && (
        <div className="space-y-3">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onApprove={handleApprove}
              onReject={handleReject}
              actionLoading={actionLoading}
            />
          ))}
        </div>
      )}

      {!loading && articles.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg hover:bg-ink-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-ink-500 px-3">Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={articles.length < 20}
            className="p-2 rounded-lg hover:bg-ink-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
