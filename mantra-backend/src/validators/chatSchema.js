import { z } from "zod";

export const sendMessageSchema = z.object({
  sessionId: z.string().uuid("Invalid session ID"),
  message: z.string().min(1, "Message cannot be empty").max(2000, "Message too long"),
});

export const createSessionSchema = z.object({
  title: z.string().max(200).optional().nullable(),
});
