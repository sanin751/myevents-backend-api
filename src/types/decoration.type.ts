import z from "zod";

export const DecorationSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  price: z.number().min(0),
  image: z.string().optional(),
  category: z.string().optional(),
  isAvailable: z.boolean().default(true)
});

export type DecorationType = z.infer<typeof DecorationSchema>;