import { fetchAllNews } from "../services/newsFetcherService.js";
import prisma from "../config/prisma.js";

const BOT_USER_ID = "00000000-0000-0000-0000-000000000000";

/**
 * Delete all bot-fetched articles older than given hours
 */
async function clearOldArticles(olderThanHours = 12) {
  const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);

  // Find old bot articles
  const oldArticles = await prisma.article.findMany({
    where: { authorId: BOT_USER_ID, publishedAt: { lt: cutoff } },
    select: { id: true },
  });

  const oldIds = oldArticles.map((a) => a.id);

  if (oldIds.length === 0) {
    console.log("🧹 No old articles to clear");
    return 0;
  }

  // Delete related records first to avoid foreign key issues
  await prisma.readHistory.deleteMany({ where: { articleId: { in: oldIds } } });
  await prisma.bookmark.deleteMany({ where: { articleId: { in: oldIds } } });
  await prisma.comment.deleteMany({ where: { articleId: { in: oldIds } } });

  // Delete the articles
  const result = await prisma.article.deleteMany({
    where: { id: { in: oldIds } },
  });

  console.log(`🧹 Cleared ${result.count} old articles`);
  return result.count;
}

/**
 * Full refresh cycle: clear old articles → fetch fresh ones
 */
async function refreshNews() {
  const timestamp = new Date().toISOString();
  console.log(`\n🔄 News refresh started at ${timestamp}`);

  try {
    // 1. Clear articles older than 12 hours
    await clearOldArticles(12);

    // 2. Fetch fresh articles
    await fetchAllNews();
  } catch (err) {
    console.error("❌ News refresh failed:", err.message);
  }
}

/**
 * Start the news refresh cron
 * Runs every 12 hours: clears old articles + fetches new ones
 */
export function startNewsCron(intervalHours = 12) {
  const intervalMs = intervalHours * 60 * 60 * 1000;

  console.log(`⏰ News cron started — refresh every ${intervalHours} hours`);

  // Run immediately on startup
  refreshNews();

  // Then repeat on interval
  setInterval(refreshNews, intervalMs);
}

/**
 * Manual trigger — can be called from a route
 */
export { refreshNews, clearOldArticles };
