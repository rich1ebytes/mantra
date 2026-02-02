import api from "./api";

export const chatAPI = {
  getSessions: () => api.get("/chat/sessions"),
  createSession: (title) => api.post("/chat/sessions", { title }),
  getSession: (id) => api.get(`/chat/sessions/${id}`),
  deleteSession: (id) => api.delete(`/chat/sessions/${id}`),

  sendMessage: (sessionId, message) =>
    api.post("/chat/messages", { sessionId, message }),

  getSuggestions: () => api.get("/chat/suggestions"),
  generateBriefing: () => api.post("/chat/briefing"),
  summarize: (articleId) => api.post(`/chat/summarize/${articleId}`),
};

/**
 * Stream a chat message via SSE
 * @param {string} sessionId
 * @param {string} message
 * @param {function} onChunk - called with each text chunk
 * @param {function} onDone - called when stream ends
 * @param {function} onError - called on error
 */
export async function streamMessage(sessionId, message, { onChunk, onArticles, onDone, onError }) {
  try {
    const session = JSON.parse(localStorage.getItem("mantra_session") || "null");
    const API_URL = import.meta.env.VITE_API_URL || "/api";

    const response = await fetch(`${API_URL}/chat/messages/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ sessionId, message }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6);

        if (data === "[DONE]") {
          onDone?.();
          return;
        }

        try {
          const parsed = JSON.parse(data);
          if (parsed.content) onChunk?.(parsed.content);
          if (parsed.articles) onArticles?.(parsed.articles);
          if (parsed.error) onError?.(parsed.error);
        } catch {}
      }
    }

    onDone?.();
  } catch (err) {
    onError?.(err.message);
  }
}
