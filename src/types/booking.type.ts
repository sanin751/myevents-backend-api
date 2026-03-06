import z from "zod";
import mongoose from "mongoose";

const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId format",
  })
  .transform((val) => new mongoose.Types.ObjectId(val));

export const BookingSchema = z.object({
  userId: objectIdSchema,
  venueId: objectIdSchema,
  eventDate: z.string(),
  guestCount: z.number(),
  totalPrice: z.number(),
  status: z.enum(["pending", "confirmed", "cancelled"]).default("pending"),
});

export type BookingType = {
  userId: mongoose.Types.ObjectId;
  venueId: mongoose.Types.ObjectId;
  eventDate: string;
  guestCount: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
};