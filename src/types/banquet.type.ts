import z from "zod";

export const BanquetSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  location: z.string().min(3),
  capacity: z.number().min(1),
  price: z.number().min(0),
  image: z.string().optional(),
  isAvailable: z.boolean().default(true)
});

export type BanquetType = z.infer<typeof BanquetSchema>;