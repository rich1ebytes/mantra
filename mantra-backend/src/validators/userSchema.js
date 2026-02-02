import { z } from "zod";

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional().nullable(),
  avatar: z.string().url().optional().nullable(),
});

export const updatePreferencesSchema = z.object({
  preferredOrigins: z.array(z.string()).max(50).optional().default([]),
  preferredCategories: z.array(z.string()).max(50).optional().default([]),
  interests: z.array(z.string().max(50)).max(20).optional().default([]),
  readingLevel: z.enum(["casual", "detailed", "expert"]).optional().nullable(),
});
