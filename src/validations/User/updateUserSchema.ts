import { z } from "zod";
import { createUserSchema } from "./createUserSchema";

export const updateUserSchema = createUserSchema.partial();

export type TUpdateUser = z.infer<typeof updateUserSchema>;