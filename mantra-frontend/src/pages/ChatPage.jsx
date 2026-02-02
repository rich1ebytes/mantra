import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Plus, Trash2, MessageSquare } from "lucide-react";
import { chatAPI, streamMessage } from "../services/chatService";
import ReactMarkdown from "react-markdown";

export default function ChatPage() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Load sessions
  useEffect(() => {
    chatAPI.getSessions().then(({ data }) => setSessions(data)).catch(() => {});
  }, []);

  // Load messages when session changes
  useEffect(() => {
    if (activeSessionId) {
      chatAPI.getSession(activeSessionId)
        .then(({ data }) => setMessages(data.messages || []))
        .catch(() => {});
    } else {
      setMessages([]);
    }
  }, [activeSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const createSession = async () => {
    try {
      const { data } = await chatAPI.createSession(null);
      setSessions((prev) => [data, ...prev]);
      setActiveSessionId(data.id);
      setMessages([]);
    } catch {}
  };

  const deleteSession = async (id) => {
    try {
      await chatAPI.deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (activeSessionId === id) {
        setActiveSessionId(null);
        setMessages([]);
      }
    } catch {}
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    if (!activeSessionId) await createSession();

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "USER", content: userMsg }]);
    setLoading(true);

    setMessages((prev) => [...prev, { role: "ASSISTANT", content: "" }]);

    const sid = activeSessionId || sessions[0]?.id;

    await streamMessage(sid, userMsg, {
      onChunk: (chunk) => {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === "ASSISTANT") last.content += chunk;
          return [...updated];
        });
      },
      onArticles: () => {},
      onDone: () => {
        setLoading(false);
        // Refresh sessions list for updated titles
        chatAPI.getSessions().then(({ data }) => setSessions(data)).catch(() => {});
      },
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
    "What's happening in tech today?",
    "Give me my morning briefing",
    "Recommend some articles for me",
    "Summarize the top stories from India",
    "What's trending in sports?",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid lg:grid-cols-[280px_1fr] gap-6 h-[calc(100vh-160px)]">
        {/* Sidebar */}
        <div className="hidden lg:flex flex-col bg-white rounded-xl border border-ink-100 overflow-hidden">
          <div className="p-4 border-b border-ink-100">
            <button onClick={createSession} className="btn-primary w-full">
              <Plus className="w-4 h-4" /> New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {sessions.map((s) => (
              <div
                key={s.id}
                className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors
                  ${s.id === activeSessionId ? "bg-mantra-50 text-mantra-700" : "hover:bg-ink-50 text-ink-700"}`}
                onClick={() => setActiveSessionId(s.id)}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-sm truncate">{s.title || "New Chat"}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {sessions.length === 0 && (
              <p className="text-center text-xs text-ink-400 py-8">No conversations yet</p>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-col bg-white rounded-xl border border-ink-100 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-ink-100">
            <Sparkles className="w-5 h-5 text-mantra-600" />
            <h2 className="font-semibold text-ink-900">Mantra AI</h2>
            <span className="text-xs text-ink-400 ml-auto">Powered by Gemini</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-mantra-100 rounded-2xl flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-mantra-600" />
                </div>
                <h3 className="font-display text-xl font-bold text-ink-950 mb-1">
                  Hi! I'm Mantra AI
                </h3>
                <p className="text-sm text-ink-500 mb-6 max-w-sm">
                  Ask me about news, get personalized recommendations, or request a daily briefing.
                </p>
                <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setInput(s)}
                      className="px-3 py-2 text-xs rounded-full bg-ink-50 text-ink-700 
                                 hover:bg-mantra-50 hover:text-mantra-700 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "USER" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                  ${msg.role === "USER"
                    ? "bg-mantra-600 text-white rounded-br-md"
                    : "bg-ink-50 text-ink-800 rounded-bl-md"}`}
                >
                  {msg.role === "ASSISTANT" ? (
                    <div className="prose-sm">
                      <ReactMarkdown>{msg.content || "Thinking..."}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {loading && messages[messages.length - 1]?.content === "" && (
              <div className="flex justify-start">
                <div className="bg-ink-50 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-ink-300 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-ink-300 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <div className="w-2 h-2 bg-ink-300 rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-ink-100">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about news, get recommendations..."
                className="flex-1 px-4 py-3 bg-ink-50 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-mantra-500/30 focus:bg-white
                           transition-all"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-3 bg-mantra-600 text-white rounded-xl hover:bg-mantra-700
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
