import prisma from "../config/prisma.js";

/**
 * Get all chat sessions for a user
 */
export async function getUserSessions(userId) {
  return prisma.chatSession.findMany({
    where: { userId },
    include: {
      _count: { select: { messages: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

/**
 * Create a new chat session
 */
export async function createSession(userId, title = null) {
  return prisma.chatSession.create({
    data: { userId, title },
  });
}

/**
 * Get a session with all its messages
 */
/**
 * Get a session with all its messages (securely)
 */
export async function getSessionWithMessages(sessionId, userId) {
  return prisma.chatSession.findFirst({
    where: { id: sessionId, userId },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
}

/**
 * Delete a chat session (and cascade messages)
 */
export async function deleteSession(sessionId, userId) {
  return prisma.chatSession.deleteMany({
    where: { id: sessionId, userId }, // ensure ownership
  });
}

/**
 * Save a message to a chat session
 */
export async function saveMessage(sessionId, role, content, recommendedArticles = []) {
  // Update session's updatedAt timestamp
  await prisma.chatSession.update({
    where: { id: sessionId },
    data: { updatedAt: new Date() },
  });

  // Auto-title the session from first user message
  if (role === "USER") {
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      select: { title: true },
    });
    if (!session?.title) {
      await prisma.chatSession.update({
        where: { id: sessionId },
        data: { title: content.substring(0, 100) },
      });
    }
  }

  return prisma.chatMessage.create({
    data: { sessionId, role, content, recommendedArticles },
  });
}

/**
 * Get messages for a session (for building AI context)
 */
export async function getMessagesBySession(sessionId, limit = 20) {
  return prisma.chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
    take: limit,
    select: { role: true, content: true },
  });
}
