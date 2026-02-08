import prisma from "../config/prisma.js";
import { generateSlug, calculateReadingTime } from "../utils/helpers.js";
import { env } from "../config/env.js";

// Map your origin codes to GNews country codes
const ORIGIN_TO_COUNTRY = {
  IN: "in",
  US: "us",
  GB: "gb",
  JP: "jp",
  DE: "de",
  BR: "br",
  AU: "au",
  AE: "ae",
};

// Map your category slugs to GNews categories
const CATEGORY_TO_GNEWS = {
  technology: "technology",
  politics: "nation",
  sports: "sports",
  business: "business",
  entertainment: "entertainment",
  science: "science",
  health: "health",
  world: "world",
};

const GNEWS_BASE = "https://gnews.io/api/v4";

/**
 * Fetch top headlines from GNews API
 */
async function fetchFromGNews(country, category, max = 5) {
  const url = `${GNEWS_BASE}/top-headlines?country=${country}&category=${category}&max=${max}&lang=en&apikey=${env.GNEWS_API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    console.error(`GNews API error (${res.status}):`, text);
    return [];
  }

  const data = await res.json();
  return data.articles || [];
}

/**
 * Create a system user for auto-fetched articles (or get existing)
 */
async function getSystemUser() {
  let user = await prisma.user.findUnique({ where: { username: "mantra-news-bot" } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: "00000000-0000-0000-0000-000000000000",
        email: "bot@mantra.news",
        username: "mantra-news-bot",
        displayName: "Mantra News Bot",
        role: "ADMIN",
      },
    });
    console.log("📰 Created system news bot user");
  }

  return user;
}

/**
 * Store a fetched article in the database (skip duplicates)
 */
async function storeArticle(article, originId, categoryId, authorId) {
  // Use the article URL as a dedup key via slug
  const slug = generateSlug(article.title);

  // Check if already exists
  const exists = await prisma.article.findUnique({ where: { slug } });
  if (exists) return null;

  try {
    const content = article.content || article.description || "Read full article at the source.";

    return await prisma.article.create({
      data: {
        title: article.title,
        slug,
        summary: article.description || article.title,
        content,
        thumbnail: article.image || null,
        authorId,
        originId,
        categoryId,
        tags: [],
        status: "PUBLISHED",
        publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(),
        readingTime: calculateReadingTime(content),
        viewsCount: 0,
        likesCount: 0,
      },
    });
  } catch (err) {
    // Unique constraint or other error — skip silently
    if (err.code !== "P2002") {
      console.error(`Failed to store article: ${article.title}`, err.message);
    }
    return null;
  }
}

/**
 * Fetch news for specific origin + category combo
 */
export async function fetchNews(originCode, categorySlug, max = 5) {
  const country = ORIGIN_TO_COUNTRY[originCode];
  const gnewsCategory = CATEGORY_TO_GNEWS[categorySlug];

  if (!country || !gnewsCategory) {
    console.warn(`Unknown mapping: origin=${originCode}, category=${categorySlug}`);
    return 0;
  }

  const origin = await prisma.origin.findUnique({ where: { code: originCode } });
  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!origin || !category) return 0;

  const systemUser = await getSystemUser();
  const articles = await fetchFromGNews(country, gnewsCategory, max);

  let stored = 0;
  for (const article of articles) {
    const result = await storeArticle(article, origin.id, category.id, systemUser.id);
    if (result) stored++;
  }

  return stored;
}

/**
 * Fetch news across all origins and selected categories
 * Designed to stay within free tier (100 req/day)
 * Default: top 3 origins × top 4 categories = 12 requests
 */
export async function fetchAllNews(options = {}) {
  const {
    origins = ["IN", "US", "GB"],
    categories = ["technology", "business", "sports", "world"],
    maxPerRequest = 5,
  } = options;

  console.log("📡 Starting news fetch...");
  let totalStored = 0;
  let totalRequests = 0;

  for (const originCode of origins) {
    for (const categorySlug of categories) {
      try {
        const stored = await fetchNews(originCode, categorySlug, maxPerRequest);
        totalStored += stored;
        totalRequests++;
        console.log(`  ✅ ${originCode}/${categorySlug}: ${stored} new articles`);

        // Small delay to be nice to the API
        await new Promise((r) => setTimeout(r, 500));
      } catch (err) {
        console.error(`  ❌ ${originCode}/${categorySlug}: ${err.message}`);
      }
    }
  }

  console.log(`📰 Fetch complete: ${totalStored} new articles from ${totalRequests} requests`);
  return { totalStored, totalRequests };
}

