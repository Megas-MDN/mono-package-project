import { z } from "zod";

const alphanumericString = z
  .string()
  .regex(/^[a-zA-Z0-9]*$/, "Search can only contain alphanumeric characters");

export const querySchema = z.object({
  search: alphanumericString.optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || !isNaN(val), {
      message: "Page must be a valid number",
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || !isNaN(val), {
      message: "Limit must be a valid number",
    }),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || !isNaN(val), {
      message: "Offset must be a valid number",
    }),
  orderBy: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return [];
      return val.split(",").map((pair) => {
        const [field, direction] = pair.split(":");
        return { field, direction };
      });
    })
    .refine(
      (val) =>
        val.every(
          ({ field, direction }) =>
            field && ["asc", "desc"].includes(direction),
        ),
      {
        message:
          "Each orderBy must have a valid format: 'field:asc' or 'field:desc'",
      },
    ),
});

export type TQuery = z.infer<typeof querySchema>;
