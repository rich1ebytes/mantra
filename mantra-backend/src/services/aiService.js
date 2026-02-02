import { geminiModel, geminiFlash } from "../config/gemini.js";
import {
  SYSTEM_PROMPT,
  BRIEFING_PROMPT,
  RECOMMENDATION_PROMPT,
  SUMMARIZE_PROMPT,
} from "../utils/prompts.js";

class AIService {
  /**
   * General chat — returns full response text
   */
  async chat(userMessage, conversationHistory = [], userContext = {}) {
    const systemPrompt = this._buildSystemPrompt(userContext);

    const chat = geminiModel.startChat({
      history: this._formatHistory(conversationHistory),
      systemInstruction: systemPrompt,
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  }

  /**
   * Streaming chat — yields text chunks for SSE
   */
  async *streamChat(userMessage, conversationHistory = [], userContext = {}) {
    const systemPrompt = this._buildSystemPrompt(userContext);

    const chat = geminiModel.startChat({
      history: this._formatHistory(conversationHistory),
      systemInstruction: systemPrompt,
    });

    const result = await chat.sendMessageStream(userMessage);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) yield text;
    }
  }

  /**
   * Summarize an article
   */
  async summarizeArticle(articleContent, title) {
    const prompt = `${SUMMARIZE_PROMPT}\n\nTitle: ${title}\nContent: ${articleContent}`;
    const result = await geminiFlash.generateContent(prompt);
    return result.response.text();
  }

  /**
   * Personalized daily briefing
   */
  async generateBriefing(userPreferences, topArticles) {
    const prompt = `${BRIEFING_PROMPT}

User interests: ${userPreferences.interests?.join(", ") || "general news"}
Preferred origins: ${userPreferences.preferredOrigins?.join(", ") || "all"}
Preferred categories: ${userPreferences.preferredCategories?.join(", ") || "all"}

Today's top articles:
${topArticles.map((a, i) => `${i + 1}. [${a.origin?.name || "Unknown"}] ${a.title} — ${a.summary}`).join("\n")}`;

    const result = await geminiModel.generateContent(prompt);
    return result.response.text();
  }

  /**
   * AI-powered article recommendations
   */
  async getRecommendations(userPreferences, readHistory, candidateArticles) {
    const prompt = `${RECOMMENDATION_PROMPT}

User Preferences: ${JSON.stringify(userPreferences)}
Recently Read: ${readHistory.map((a) => a.title).join(", ") || "nothing yet"}
Candidate Articles: ${JSON.stringify(
      candidateArticles.map((a) => ({
        id: a.id,
        title: a.title,
        origin: a.origin?.name,
        category: a.category?.name,
        summary: a.summary,
      }))
    )}`;

    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text();

    // Parse JSON response from Gemini
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      console.error("Failed to parse AI recommendations:", text);
      return [];
    }
  }

  // ── Private Helpers ──

  _buildSystemPrompt(userContext) {
    return SYSTEM_PROMPT.replace("{origins}", userContext.preferredOrigins?.join(", ") || "all")
      .replace("{categories}", userContext.preferredCategories?.join(", ") || "all")
      .replace("{interests}", userContext.interests?.join(", ") || "general")
      .replace("{readingLevel}", userContext.readingLevel || "casual")
      .replace("{articleContext}", userContext.articleContext || "No articles loaded for this query.");
  }

  _formatHistory(history) {
    return history
      .filter((msg) => msg.role === "USER" || msg.role === "ASSISTANT")
      .map((msg) => ({
        role: msg.role === "ASSISTANT" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));
  }
}

export default new AIService();
