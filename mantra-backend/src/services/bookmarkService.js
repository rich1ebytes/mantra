import prisma from "../config/prisma.js";

/**
 * Get all bookmarks for a user
 */
export async function getUserBookmarks(userId, { skip = 0, take = 20 } = {}) {
  return prisma.bookmark.findMany({
    where: { userId },
    include: {
      article: {
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          thumbnail: true,
          readingTime: true,
          publishedAt: true,
          author: { select: { username: true, displayName: true } },
          origin: { select: { name: true, code: true, flag: true } },
          category: { select: { name: true, slug: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });
}

/**
 * Add a bookmark
 */
export async function add(userId, articleId) {
  return prisma.bookmark.create({
    data: { userId, articleId },
  });
}

/**
 * Remove a bookmark
 */
export async function remove(userId, articleId) {
  return prisma.bookmark.delete({
    where: { userId_articleId: { userId, articleId } },
  });
}

/**
 * Check if an article is bookmarked
 */
export async function isBookmarked(userId, articleId) {
  const bookmark = await prisma.bookmark.findUnique({
    where: { userId_articleId: { userId, articleId } },
  });
  return !!bookmark;
}
