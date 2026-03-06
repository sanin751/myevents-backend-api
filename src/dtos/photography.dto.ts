import z from "zod";
import { PhotographyPackageSchema } from "../types/photography.type";

export const CreatePhotographyPackageDTO = PhotographyPackageSchema.pick({
  title: true,
  description: true,
  price: true,
  duration: true,
  features: true,
  image: true,
  isActive: true
});

export type CreatePhotographyPackageDTO = z.infer<typeof CreatePhotographyPackageDTO>;

export const UpdatePhotographyPackageDTO = PhotographyPackageSchema.partial();

export type UpdatePhotographyPackageDTO = z.infer<typeof UpdatePhotographyPackageDTO>;