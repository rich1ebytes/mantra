import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, ArrowRight, ExternalLink } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { chatAPI } from "../../services/chatService";
import { useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

function MiniArticleCards({ articles }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="mt-2 space-y-1.5">
      {articles.slice(0, 3).map((article) => (
        <Link
          key={article.id}
          to={`/article/${article.slug || article.id}`}
          className="flex items-center gap-2 p-2 bg-white border border-ink-100 rounded-lg 
                     hover:border-mantra-300 transition-all group"
        >
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-ink-800 line-clamp-1 group-hover:text-mantra-700">
              {article.title}
            </p>
            {article.origin?.name && (
              <p className="text-[10px] text-ink-400 mt-0.5">{article.origin.name}</p>
            )}
          </div>
          <ExternalLink className="w-3 h-3 text-ink-300 shrink-0" />
        </Link>
      ))}
    </div>
  );
}

export default function ChatWidget() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const sessionIdRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Scroll only the chat container, not the page
  useEffect(() => {
    if (messages.length > 0 && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages.length]);

  // Create session on first open
  const ensureSession = async () => {
    if (sessionIdRef.current) return sessionIdRef.current;
    try {
      const { data } = await chatAPI.createSession("Quick Chat");
      sessionIdRef.current = data.id;
      return data.id;
    } catch {
      return null;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg, articles: [] }]);
    setLoading(true);

    const sid = await ensureSession();
    if (!sid) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Failed to create chat session.", articles: [] }]);
      setLoading(false);
      return;
    }

    try {
      const { data } = await chatAPI.sendMessage(sid, userMsg);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message,
          articles: data.articles || [],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
          articles: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "What's trending today?",
    "Give me a briefing",
    "Tech news from India",
  ];

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-mantra-500 to-mantra-700 text-white rounded-full
                       shadow-lg hover:shadow-xl hover:shadow-mantra-500/40
                       transition-shadow duration-300 flex items-center justify-center pulse-glow"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] bg-white rounded-2xl 
                        shadow-2xl border border-ink-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-mantra-600 to-mantra-700 text-white">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                <span className="font-semibold text-sm">Mantra AI</span>
              </div>
              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate("/chat")}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  title="Open full chat"
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-8 h-8 text-mantra-400 mx-auto mb-3" />
                  </motion.div>
                  <p className="text-sm text-ink-600 font-medium mb-1">Hi! I'm Mantra AI</p>
                  <p className="text-xs text-ink-400 mb-4">Ask me about news, get recommendations, or a briefing.</p>
                  <div className="space-y-2">
                    {suggestions.map((s, idx) => (
                      <motion.button
                        key={s}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        onClick={() => setInput(s)}
                        className="block w-full text-left text-xs px-3 py-2 rounded-lg
                                 bg-mantra-50 text-mantra-700 hover:bg-mantra-100 transition-colors"
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[85%]">
                    <div className={`px-3 py-2 rounded-xl text-sm leading-relaxed
                      ${msg.role === "user"
                        ? "bg-gradient-to-br from-mantra-500 to-mantra-600 text-white rounded-br-sm shadow-sm"
                        : "bg-ink-100 text-ink-800 rounded-bl-sm"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div className="prose-sm">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        msg.content
                      )}
                    </div>
                    {msg.role === "assistant" && <MiniArticleCards articles={msg.articles} />}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-ink-100 px-4 py-2 rounded-xl rounded-bl-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-ink-400 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-ink-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                        <div className="w-1.5 h-1.5 bg-ink-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                      </div>
                      <span className="text-xs text-ink-400">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-ink-100">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about news..."
                  className="flex-1 px-3 py-2 bg-ink-50 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-mantra-500/30"
                  disabled={loading}
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2 bg-mantra-600 text-white rounded-lg hover:bg-mantra-700
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
