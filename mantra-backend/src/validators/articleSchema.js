import { z } from "zod";

export const createArticleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  summary: z.string().min(10, "Summary must be at least 10 characters").max(500),
  content: z.string().min(50, "Article content must be at least 50 characters"),
  thumbnail: z.string().url().optional().nullable(),
  originId: z.string().uuid("Invalid origin ID"),
  categoryId: z.string().uuid("Invalid category ID"),
  tags: z.array(z.string().max(50)).max(10).optional().default([]),
  status: z.enum(["DRAFT", "PENDING"]).optional().default("DRAFT"),
});

export const updateArticleSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  summary: z.string().min(10).max(500).optional(),
  content: z.string().min(50).optional(),
  thumbnail: z.string().url().optional().nullable(),
  originId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  status: z.enum(["DRAFT", "PENDING"]).optional(),
});
