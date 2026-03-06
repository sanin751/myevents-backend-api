import mongoose from "mongoose";
import { IBooking, BookingModel } from "../models/booking.model";

export interface IBookingRepository {
  createBooking(data: Partial<IBooking>): Promise<IBooking>;
  getBookingById(id: string): Promise<IBooking | null>;
  getBookingsByUser(userId: mongoose.Types.ObjectId): Promise<IBooking[]>;
  getAllBookings(): Promise<IBooking[]>; 
  updateBooking(id: string, data: Partial<IBooking>): Promise<IBooking | null>;
  deleteBooking(id: string): Promise<boolean>;
}

export class BookingRepository implements IBookingRepository {

  async createBooking(data: Partial<IBooking>): Promise<IBooking> {
    const booking = new BookingModel(data);
    return await booking.save();
  }

  async getBookingById(id: string): Promise<IBooking | null> {
    return await BookingModel.findById(id);
  }

  async getBookingsByUser(userId: mongoose.Types.ObjectId): Promise<IBooking[]> {
    return await BookingModel.find({ userId });
  }

  async getAllBookings(): Promise<IBooking[]> {
    return await BookingModel
      .find()
      .populate("userId")
      .populate("venueId");
  }

  async updateBooking(id: string, data: Partial<IBooking>): Promise<IBooking | null> {
    return await BookingModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteBooking(id: string): Promise<boolean> {
    const result = await BookingModel.findByIdAndDelete(id);
    return result ? true : false;
  }
}