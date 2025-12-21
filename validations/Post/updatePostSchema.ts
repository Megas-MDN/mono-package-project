import { z } from "zod";

export const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional(),
  published: z.boolean().optional(),
});

export type TUpdatePost = z.infer<typeof updatePostSchema>;
