import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  imageURL: z.string().optional(),
});

export type TCreateUser = z.infer<typeof createUserSchema>;
