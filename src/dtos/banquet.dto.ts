import z from "zod";
import { BanquetSchema } from "../types/banquet.type";

export const CreateBanquetDTO = z.object({
  title: z.string(),
  location: z.string(),
  price: z.coerce.number(),
  capacity: z.coerce.number(),
  image: z.string().optional()
});

export type CreateBanquetDTO = z.infer<typeof CreateBanquetDTO>;

export const UpdateBanquetDTO = BanquetSchema.partial();

export type UpdateBanquetDTO = z.infer<typeof UpdateBanquetDTO>;