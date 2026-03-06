import z from "zod";
import { DecorationSchema } from "../types/decoration.type";

export const CreateDecorationDTO = DecorationSchema.pick({
  title: true,
  description: true,
  price: true,
  image: true,
  category: true,
  isAvailable: true
});

export type CreateDecorationDTO = z.infer<typeof CreateDecorationDTO>;

export const UpdateDecorationDTO = DecorationSchema.pick({
  title: true,
  description: true,
  price: true,
  image: true,
  category: true,
  isAvailable: true
}).partial();

export type UpdateDecorationDTO = z.infer<typeof UpdateDecorationDTO>;