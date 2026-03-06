import mongoose, { Schema, Document } from "mongoose";
import { BookingType } from "../types/booking.type";

const BookingSchema: Schema = new Schema<BookingType>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  venueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Venue",
    required: true
  },

  eventDate: { type: String, required: true },

  guestCount: { type: Number, required: true },

  totalPrice: { type: Number, required: true },

  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending"
  }
},
{
  timestamps: true
});

export interface IBooking extends BookingType, Document {
  _id: mongoose.Types.ObjectId;
}

export const BookingModel = mongoose.model<IBooking>("Booking", BookingSchema);