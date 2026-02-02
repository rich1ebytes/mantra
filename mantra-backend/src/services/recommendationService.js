import aiService from "./aiService.js";
import * as articleService from "./articleService.js";
import * as userService from "./userService.js";

/**
 * Get AI-powered article recommendations for a user
 */
export async function getRecommendations(userId) {
  // 1. Fetch user preferences and history
  const preferences = await userService.getPreferences(userId);
  const history = await userService.getReadingHistory(userId, { take: 10 });
  const readArticles = history.map((h) => h.article);

  // 2. Fetch candidate articles (exclude already-read ones)
  const readIds = readArticles.map((a) => a.id);
  const { articles: candidates } = await articleService.getAll({
    status: "PUBLISHED",
    take: 30,
    orderBy: "publishedAt",
  });

  const filtered = candidates.filter((a) => !readIds.includes(a.id));

  // 3. Ask AI to rank them
  const recommendations = await aiService.getRecommendations(
    preferences,
    readArticles,
    filtered.slice(0, 20) // limit context size
  );

  // 4. Map AI recommendations back to full article data
  return recommendations
    .map((rec) => {
      const article = filtered.find((a) => a.id === rec.id);
      return article ? { ...article, aiReason: rec.reason } : null;
    })
    .filter(Boolean);
}
