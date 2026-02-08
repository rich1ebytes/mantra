import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Save, ArrowLeft, AlertCircle } from "lucide-react";
import { articleAPI } from "../services/articleService";
import { useOrigins, useCategories } from "../hooks/useData";

export default function WritePage() {
  const navigate = useNavigate();
  const { data: origins } = useOrigins();
  const { data: categories } = useCategories();

  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    originId: "",
    categoryId: "",
    tags: "",
    thumbnail: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setError("");
  };

  const handleSubmit = async (status = "DRAFT") => {
    setError("");

    if (!form.title || !form.summary || !form.content || !form.originId || !form.categoryId) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean) : [],
        thumbnail: form.thumbnail || null,
        status,
      };
      await articleAPI.create(payload);

      if (status === "DRAFT") {
        alert("✅ Draft saved successfully!");
        navigate("/drafts");
      } else {
        alert("✅ Article submitted for review!");
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create article.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-mantra-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="font-display text-3xl font-bold text-ink-950 mb-8">Write an Article</h1>

      {error && (
        <div className="flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-6">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">Title *</label>
          <input type="text" value={form.title} onChange={update("title")}
            className="input-field text-lg font-display" placeholder="Your article title" />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">Summary *</label>
          <textarea value={form.summary} onChange={update("summary")}
            className="input-field h-20 resize-none" placeholder="A brief summary of your article (shown in previews)" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">Origin *</label>
            <select value={form.originId} onChange={update("originId")} className="input-field">
              <option value="">Select origin</option>
              {origins?.map((o) => (
                <option key={o.id} value={o.id}>{o.flag} {o.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">Category *</label>
            <select value={form.categoryId} onChange={update("categoryId")} className="input-field">
              <option value="">Select category</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">Content *</label>
          <p className="text-xs text-ink-400 mb-2">
            Write your article below. HTML tags like &lt;p&gt;, &lt;h2&gt;, &lt;blockquote&gt;, &lt;ul&gt; are supported.
          </p>
          <textarea value={form.content} onChange={update("content")}
            className="input-field h-64 resize-y font-mono text-sm"
            placeholder="<p>Write your article content here...</p>" />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">Thumbnail URL</label>
          <input type="url" value={form.thumbnail} onChange={update("thumbnail")}
            className="input-field" placeholder="https://example.com/image.jpg (optional)" />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">Tags</label>
          <input type="text" value={form.tags} onChange={update("tags")}
            className="input-field" placeholder="ai, technology, india (comma separated)" />
        </div>

        <div className="flex gap-3 pt-4 border-t border-ink-100">
          <button onClick={() => handleSubmit("DRAFT")} disabled={loading}
            className="btn-secondary flex-1 py-3 disabled:opacity-60">
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button onClick={() => handleSubmit("PENDING")} disabled={loading}
            className="btn-primary flex-1 py-3 disabled:opacity-60">
            <Send className="w-4 h-4" /> Submit for Review
          </button>
        </div>
      </div>
    </div>
  );
}
