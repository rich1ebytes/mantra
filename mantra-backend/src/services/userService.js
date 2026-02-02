import prisma from "../config/prisma.js";

/**
 * Get full user profile with preferences
 */
export async function getById(userId) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { preferences: true },
  });
}

/**
 * Get public profile by username
 */
export async function getByUsername(username) {
  return prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatar: true,
      bio: true,
      role: true,
      createdAt: true,
      _count: { select: { articles: true } },
    },
  });
}

/**
 * Update user profile fields
 */
export async function updateProfile(userId, data) {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
}

/**
 * Get or create user preferences
 */
export async function getPreferences(userId) {
  let prefs = await prisma.userPreference.findUnique({
    where: { userId },
  });

  if (!prefs) {
    prefs = await prisma.userPreference.create({
      data: {
        userId,
        preferredOrigins: [],
        preferredCategories: [],
        interests: [],
      },
    });
  }

  return prefs;
}

/**
 * Update user preferences (upsert)
 */
export async function updatePreferences(userId, data) {
  return prisma.userPreference.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  });
}

/**
 * Get user reading history
 */
export async function getReadingHistory(userId, { skip = 0, take = 20 } = {}) {
  return prisma.readHistory.findMany({
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
