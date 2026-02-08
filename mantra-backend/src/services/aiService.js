import groq, { PRIMARY_MODEL, FAST_MODEL } from "../config/groq.js";
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

    const messages = [
      { role: "system", content: systemPrompt },
      ...this._formatHistory(conversationHistory),
      { role: "user", content: userMessage },
    ];

    const response = await groq.chat.completions.create({
      model: PRIMARY_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    return response.choices[0]?.message?.content || "";
  }

  /**
   * Streaming chat — yields text chunks for SSE
   */
  async *streamChat(userMessage, conversationHistory = [], userContext = {}) {
    const systemPrompt = this._buildSystemPrompt(userContext);

    const messages = [
      { role: "system", content: systemPrompt },
      ...this._formatHistory(conversationHistory),
      { role: "user", content: userMessage },
    ];

    const stream = await groq.chat.completions.create({
      model: PRIMARY_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
      stream: true,
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content;
      if (text) yield text;
    }
  }

  /**
   * Summarize an article
   */
  async summarizeArticle(articleContent, title) {
    const response = await groq.chat.completions.create({
      model: FAST_MODEL,
      messages: [
        { role: "system", content: SUMMARIZE_PROMPT },
        { role: "user", content: `Title: ${title}\nContent: ${articleContent}` },
      ],
      temperature: 0.3,
      max_tokens: 300,
    });

    return response.choices[0]?.message?.content || "";
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

    const response = await groq.chat.completions.create({
      model: PRIMARY_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 512,
    });

    return response.choices[0]?.message?.content || "";
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

    const response = await groq.chat.completions.create({
      model: PRIMARY_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 512,
    });

    const text = response.choices[0]?.message?.content || "";

    // Parse JSON response
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
        role: msg.role === "ASSISTANT" ? "assistant" : "user",
        content: msg.content,
      }));
  }
}

export default new AIService();
