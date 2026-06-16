import type { Request, Response } from "express";
import { httpStatus } from "../constants/httpStatus.js";
import { bookingService } from "../services/booking.service.js";
import type { CreateBookingInput } from "../validators/booking.validator.js";

export const bookingController = {
  async createBooking(req: Request, res: Response) {
    const booking = await bookingService.createBooking(req.body as CreateBookingInput, req.user!.id);
    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Booking created successfully.",
      data: { booking }
    });
  },

  async getMyBookings(req: Request, res: Response) {
    const bookings = await bookingService.getMyBookings(req.user!.id);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Bookings fetched successfully.",
      data: { bookings }
    });
  },

  async getBookingHistory(req: Request, res: Response) {
    const bookings = await bookingService.getBookingHistory(req.user!.id, req.user!.role, req.query.status as string);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Booking history fetched successfully.",
      data: { bookings }
    });
  },

  async addReview(req: Request, res: Response) {
    const review = await bookingService.addReview(req.params.id, req.user!.id, req.body);
    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Feedback submitted successfully.",
      data: { review }
    });
  }
};
