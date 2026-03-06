import z from "zod";

export const PhotographyPackageSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  price: z.number().min(0),
  duration: z.string().optional(),
  features: z.array(z.string()).optional(),
  image: z.string().optional(),
  isActive: z.boolean().default(true)
});

export type PhotographyPackageType = z.infer<typeof PhotographyPackageSchema>;