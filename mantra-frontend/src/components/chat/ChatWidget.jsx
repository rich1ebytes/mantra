import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { chatAPI, streamMessage } from "../../services/chatService";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function ChatWidget() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Create session on first open
  const ensureSession = async () => {
    if (sessionId) return sessionId;
    try {
      const { data } = await chatAPI.createSession("Quick Chat");
      setSessionId(data.id);
      return data.id;
    } catch {
      return null;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    const sid = await ensureSession();
    if (!sid) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Failed to create chat session." }]);
      setLoading(false);
      return;
    }

    // Add placeholder for streaming
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    await streamMessage(sid, userMsg, {
      onChunk: (chunk) => {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === "assistant") {
            last.content += chunk;
          }
          return [...updated];
        });
      },
      onArticles: () => {},
      onDone: () => setLoading(false),
      onError: (err) => {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content = `Error: ${err}`;
          return [...updated];
        });
        setLoading(false);
      },
    });
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
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-mantra-600 text-white rounded-full
                     shadow-lg shadow-mantra-600/30 hover:bg-mantra-700 hover:scale-105
                     transition-all duration-200 flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] bg-white rounded-2xl 
                        shadow-2xl border border-ink-100 flex flex-col overflow-hidden
                        animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-mantra-600 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold text-sm">Mantra AI</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate("/chat")}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                title="Open full chat"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Sparkles className="w-8 h-8 text-mantra-400 mx-auto mb-3" />
                <p className="text-sm text-ink-600 font-medium mb-1">Hi! I'm Mantra AI</p>
                <p className="text-xs text-ink-400 mb-4">Ask me about news, get recommendations, or a briefing.</p>
                <div className="space-y-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setInput(s); }}
                      className="block w-full text-left text-xs px-3 py-2 rounded-lg
                                 bg-mantra-50 text-mantra-700 hover:bg-mantra-100 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed
                  ${msg.role === "user"
                    ? "bg-mantra-600 text-white rounded-br-sm"
                    : "bg-ink-100 text-ink-800 rounded-bl-sm"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose-sm">
                      <ReactMarkdown>{msg.content || "..."}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-ink-100 px-4 py-2 rounded-xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-ink-400 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-ink-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <div className="w-1.5 h-1.5 bg-ink-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
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
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 bg-mantra-600 text-white rounded-lg hover:bg-mantra-700
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
