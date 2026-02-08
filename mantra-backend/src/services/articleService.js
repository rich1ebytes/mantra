import prisma from "../config/prisma.js";
import { generateSlug, calculateReadingTime } from "../utils/helpers.js";

const ARTICLE_INCLUDE = {
  author: { select: { id: true, username: true, displayName: true, avatar: true } },
  origin: { select: { id: true, name: true, code: true, flag: true } },
  category: { select: { id: true, name: true, slug: true, icon: true } },
  _count: { select: { bookmarks: true, comments: true } },
};

/**
 * Get paginated articles with filters
 */
export async function getAll({ originId, categoryId, status = "PUBLISHED", skip = 0, take = 20, orderBy = "publishedAt" } = {}) {
  const where = { status };
  if (originId) where.originId = originId;
  if (categoryId) where.categoryId = categoryId;

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: ARTICLE_INCLUDE,
      orderBy: { [orderBy]: "desc" },
      skip,
      take,
    }),
    prisma.article.count({ where }),
  ]);

  return { articles, total };
}

/**
 * Get trending articles based on views + recency
 */
export async function getTrending({ origins, categories, limit = 10 } = {}) {
  const where = { status: "PUBLISHED" };
  if (origins?.length) where.origin = { code: { in: origins } };
  if (categories?.length) where.category = { slug: { in: categories } };

  return prisma.article.findMany({
    where,
    include: ARTICLE_INCLUDE,
    orderBy: [{ viewsCount: "desc" }, { publishedAt: "desc" }],
    take: limit,
  });
}

/**
 * Full-text search on title, summary, tags
 */
export async function search(query, { skip = 0, take = 20 } = {}) {
  const where = {
    status: "PUBLISHED",
    OR: [
      { title: { contains: query, mode: "insensitive" } },
      { summary: { contains: query, mode: "insensitive" } },
      { tags: { has: query.toLowerCase() } },
    ],
  };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: ARTICLE_INCLUDE,
      orderBy: { publishedAt: "desc" },
      skip,
      take,
    }),
    prisma.article.count({ where }),
  ]);

  return { articles, total };
}

/**
 * Get single article by slug (increments view count)
 */
export async function getBySlug(slug) {
  const article = await prisma.article.update({
    where: { slug, status: "PUBLISHED" },
    data: { viewsCount: { increment: 1 } },
    include: {
      ...ARTICLE_INCLUDE,
      comments: {
        where: { parentId: null },
        include: {
          user: { select: { id: true, username: true, displayName: true, avatar: true } },
          replies: {
            include: {
              user: { select: { id: true, username: true, displayName: true, avatar: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return article;
}

/**
 * Get single article by ID
 */
export async function getById(id) {
  return prisma.article.findUnique({
    where: { id },
    include: ARTICLE_INCLUDE,
  });
}

/**
 * Create a new article
 */
export async function create(authorId, data) {
  return prisma.article.create({
    data: {
      ...data,
      authorId,
      slug: generateSlug(data.title),
      readingTime: calculateReadingTime(data.content),
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
    },
    include: ARTICLE_INCLUDE,
  });
}

/**
 * Update an article
 */
export async function update(id, data) {
  const updateData = { ...data };
  if (data.content) {
    updateData.readingTime = calculateReadingTime(data.content);
  }
  if (data.title) {
    updateData.slug = generateSlug(data.title);
  }

  return prisma.article.update({
    where: { id },
    data: updateData,
    include: ARTICLE_INCLUDE,
  });
}

/**
 * Delete an article
 */
export async function remove(id) {
  return prisma.article.delete({ where: { id } });
}

/**
 * Update article status (moderation)
 */
export async function updateStatus(id, status) {
  const data = { status };
  if (status === "PUBLISHED") {
    data.publishedAt = new Date();
  }
  return prisma.article.update({
    where: { id },
    data,
    include: ARTICLE_INCLUDE,
  });
}

/**
 * Get pending articles for moderation
 */
export async function getPending({ skip = 0, take = 20 } = {}) {
  return prisma.article.findMany({
    where: { status: "PENDING" },
    include: ARTICLE_INCLUDE,
    orderBy: { createdAt: "asc" },
    skip,
    take,
  });
}

/**
 * Search articles for AI context building — returns slim results
 * Falls back to latest articles if no keyword match
 */
export async function searchForContext(query, limit = 5) {
  const contextSelect = {
    id: true,
    title: true,
    slug: true,
    summary: true,
    thumbnail: true,
    origin: { select: { name: true } },
    category: { select: { name: true } },
  };

  // Try keyword match first
  const matched = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { summary: { contains: query, mode: "insensitive" } },
        { tags: { hasSome: query.toLowerCase().split(" ") } },
      ],
    },
    select: contextSelect,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });

  // If no keyword match, return latest published articles
  if (matched.length === 0) {
    return prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: contextSelect,
      orderBy: { publishedAt: "desc" },
      take: limit,
    });
  }

  return matched;
}

export async function getByAuthor(authorId) {
  return prisma.article.findMany({
    where: {
      authorId,
      status: { in: ["DRAFT", "PENDING", "REJECTED"] },
    },
    include: ARTICLE_INCLUDE,
    orderBy: { updatedAt: "desc" },
  });
}