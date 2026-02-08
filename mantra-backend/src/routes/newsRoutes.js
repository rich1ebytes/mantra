import { Router } from "express";
import { fetchAllNews, fetchNews } from "../services/newsFetcherService.js";
import { refreshNews, clearOldArticles } from "../jobs/newsCron.js";

const router = Router();

/**
 * POST /api/news/fetch — Manually trigger a full news fetch
 */
router.post("/fetch", async (req, res, next) => {
  try {
    const { origins, categories, maxPerRequest } = req.body;
    const result = await fetchAllNews({ origins, categories, maxPerRequest });
    res.json({
      message: "News fetch complete",
      ...result,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/news/fetch/:origin/:category — Fetch for a specific origin+category
 */
router.post("/fetch/:origin/:category", async (req, res, next) => {
  try {
    const stored = await fetchNews(req.params.origin, req.params.category);
    res.json({ message: `Fetched ${stored} new articles` });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/news/refresh — Clear old articles + fetch fresh ones
 */
router.post("/refresh", async (req, res, next) => {
  try {
    await refreshNews();
    res.json({ message: "News refresh complete — old articles cleared, fresh ones fetched" });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/news/clear — Clear all old bot articles
 */
router.delete("/clear", async (req, res, next) => {
  try {
    const hours = parseInt(req.query.hours) || 12;
    const count = await clearOldArticles(hours);
    res.json({ message: `Cleared ${count} old articles` });
  } catch (err) {
    next(err);
  }
});

export default router;
