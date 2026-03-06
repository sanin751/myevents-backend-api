import { BookingRepository } from "../repository/booking.repository";
import { CreateBookingDTO, UpdateBookingDTO } from "../dtos/booking.dto";
import { HttpError } from "../error/http-error";
import mongoose from "mongoose";

const bookingRepository = new BookingRepository();

export class BookingService {

  async createBooking(userId: string, data: CreateBookingDTO) {

    const booking = await bookingRepository.createBooking({
      ...data,
      userId: new mongoose.Types.ObjectId(userId)
    });

    return booking;
  }

  async getAllBookings() {

    const bookings = await bookingRepository.getAllBookings();

    return bookings;
  }

  async getBookingById(id: string) {

    const booking = await bookingRepository.getBookingById(id);

    if (!booking) {
      throw new HttpError(404, "Booking not found");
    }

    return booking;
  }

  async getUserBookings(userId: string) {

    return await bookingRepository.getBookingsByUser(
      new mongoose.Types.ObjectId(userId)
    );
  }

  async updateBooking(id: string, data: UpdateBookingDTO) {

    const booking = await bookingRepository.updateBooking(id, data);

    if (!booking) {
      throw new HttpError(404, "Booking not found");
    }

    return booking;
  }

  async deleteBooking(id: string) {

    const deleted = await bookingRepository.deleteBooking(id);

    if (!deleted) {
      throw new HttpError(404, "Booking not found");
    }

    return true;
  }
}