import { Request, Response } from "express";
import { BookingService } from "../service/booking.service";
import { CreateBookingDTO, UpdateBookingDTO } from "../dtos/booking.dto";
import z from "zod";

const bookingService = new BookingService();

export class BookingController {

  async createBooking(req: Request, res: Response) {
    try {

      const parsedData = CreateBookingDTO.safeParse(req.body);

      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error)
        });
      }

      const userId = req.user?._id;

      const booking = await bookingService.createBooking(userId, parsedData.data);

      return res.status(200).json({
        success: true,
        message: "Booking created",
        data: booking
      });

    } catch (error: any) {

      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error"
      });

    }
  }

  async getBookingById(req: Request, res: Response) {
    try {

      const booking = await bookingService.getBookingById(req.params.id);

      return res.status(200).json({
        success: true,
        data: booking
      });

    } catch (error: any) {

      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message
      });

    }
  }

  async getMyBookings(req: Request, res: Response) {
    try {

      const userId = req.user?._id;

      const bookings = await bookingService.getUserBookings(userId);

      return res.status(200).json({
        success: true,
        data: bookings
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message
      });

    }
  }

  async updateBooking(req: Request, res: Response) {
    try {

      const parsedData = UpdateBookingDTO.safeParse(req.body);

      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error)
        });
      }

      const booking = await bookingService.updateBooking(
        req.params.id,
        parsedData.data
      );

      return res.status(200).json({
        success: true,
        message: "Booking updated",
        data: booking
      });

    } catch (error: any) {

      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message
      });

    }
  }
  async getAllBookings(req: Request, res: Response) {
  try {

    const bookings = await bookingService.getAllBookings();

    return res.status(200).json({
      success: true,
      data: bookings
    });

  } catch (error: any) {

    return res.status(error.statusCode ?? 500).json({
      success: false,
      message: error.message
    });

  }
}

  async deleteBooking(req: Request, res: Response) {
    try {

      await bookingService.deleteBooking(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Booking deleted"
      });

    } catch (error: any) {

      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message
      });


    }
  }
}