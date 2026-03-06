import z from "zod";
import { BookingSchema } from "../types/booking.type";

export const CreateBookingDTO = BookingSchema.pick({
  venueId: true,
  eventDate: true,
  guestCount: true,
  totalPrice: true
});

export type CreateBookingDTO = z.infer<typeof CreateBookingDTO>;

export const UpdateBookingDTO = BookingSchema.pick({
  eventDate: true,
  guestCount: true,
  totalPrice: true,
  status: true
}).partial();

export type UpdateBookingDTO = z.infer<typeof UpdateBookingDTO>;