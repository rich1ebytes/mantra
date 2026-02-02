import aiService from "../services/aiService.js";
import * as chatService from "../services/chatService.js";
import * as articleService from "../services/articleService.js";
import * as userService from "../services/userService.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * POST /api/chat/messages — Send message, get full JSON response
 */
export async function sendMessage(req, res, next) {
  try {
    const { sessionId, message } = req.body;

    // Verify session ownership
    const session = await chatService.getSessionWithMessages(sessionId, req.userId);
    if (!session) throw ApiError.notFound("Chat session not found");

    // Save user message
    await chatService.saveMessage(sessionId, "USER", message);

    // Get conversation history
    const history = await chatService.getMessagesBySession(sessionId);

    // Build AI context from user preferences + relevant articles
    const preferences = await userService.getPreferences(req.userId);
    const relevantArticles = await articleService.searchForContext(message);
    const userContext = {
      ...preferences,
      articleContext: relevantArticles
        .map((a) => `[${a.origin.name}] ${a.title}: ${a.summary}`)
        .join("\n"),
    };

    // Get AI response
    const response = await aiService.chat(message, history, userContext);

    // Save assistant response
    const articleIds = relevantArticles.map((a) => a.id);
    await chatService.saveMessage(sessionId, "ASSISTANT", response, articleIds);

    res.json({
      message: response,
      articles: relevantArticles,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/chat/messages/stream — Send message, get SSE streaming response
 */
export async function streamMessage(req, res, next) {
  const { sessionId, message } = req.body;

  // Verify session ownership (sync check before stream)
  const session = await chatService.getSessionWithMessages(sessionId, req.userId);
  if (!session) {
    res.status(404).json({ error: "Chat session not found" });
    return;
  }

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    // Save user message
    await chatService.saveMessage(sessionId, "USER", message);

    // Get conversation history
    const history = await chatService.getMessagesBySession(sessionId);

    // Build AI context
    const preferences = await userService.getPreferences(req.userId);
    const relevantArticles = await articleService.searchForContext(message);
    const userContext = {
      ...preferences,
      articleContext: relevantArticles
        .map((a) => `[${a.origin.name}] ${a.title}: ${a.summary}`)
        .join("\n"),
    };

    // Stream Gemini response
    let fullResponse = "";
    for await (const chunk of aiService.streamChat(message, history, userContext)) {
      fullResponse += chunk;
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
    }

    // Send article context at the end
    res.write(`data: ${JSON.stringify({ articles: relevantArticles })}\n\n`);

    // Save assistant response
    const articleIds = relevantArticles.map((a) => a.id);
    await chatService.saveMessage(sessionId, "ASSISTANT", fullResponse, articleIds);

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
}

/**
 * POST /api/chat/briefing — Generate daily news briefing
 */
export async function generateBriefing(req, res, next) {
  try {
    const preferences = await userService.getPreferences(req.userId);
    const topArticles = await articleService.getTrending({
      origins: preferences.preferredOrigins,
      categories: preferences.preferredCategories,
      limit: 10,
    });

    const briefing = await aiService.generateBriefing(preferences, topArticles);
    res.json({ briefing, articles: topArticles });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/chat/summarize/:articleId — Summarize an article
 */
export async function summarizeArticle(req, res, next) {
  try {
    const article = await articleService.getById(req.params.articleId);
    if (!article) throw ApiError.notFound("Article not found");

    const summary = await aiService.summarizeArticle(article.content, article.title);
    res.json({ summary, articleId: article.id });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/chat/sessions — List user's chat sessions
 */
export async function getSessions(req, res, next) {
  try {
    const sessions = await chatService.getUserSessions(req.userId);
    res.json(sessions);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/chat/sessions — Create new chat session
 */
export async function createSession(req, res, next) {
  try {
    const session = await chatService.createSession(req.userId, req.body.title);
    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/chat/sessions/:id — Get session with all messages
 */
export async function getSessionWithMessages(req, res, next) {
  try {
    const session = await chatService.getSessionWithMessages(req.params.id, req.userId);
    if (!session) throw ApiError.notFound("Chat session not found");
    res.json(session);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/chat/sessions/:id — Delete a chat session
 */
export async function deleteSession(req, res, next) {
  try {
    await chatService.deleteSession(req.params.id, req.userId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/chat/suggestions — Suggested queries for the chat
 */
export async function getSuggestions(_req, res) {
  res.json({
    suggestions: [
      "What's happening in tech today?",
      "Give me my morning briefing",
      "Summarize the top stories from India",
      "Find articles about AI and startups",
      "What's trending in sports?",
      "Explain the latest business news",
      "Any science discoveries this week?",
    ],
  });
}
