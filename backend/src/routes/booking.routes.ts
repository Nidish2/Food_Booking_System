import { Router } from "express";
import { bookingController } from "../controllers/booking.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createBookingSchema, reviewSchema } from "../validators/booking.validator.js";

export const bookingRoutes = Router();

bookingRoutes.use(requireAuth);
bookingRoutes.post("/", validate(createBookingSchema), asyncHandler(bookingController.createBooking));
bookingRoutes.get("/my", asyncHandler(bookingController.getMyBookings));
bookingRoutes.get("/history", asyncHandler(bookingController.getBookingHistory));
bookingRoutes.post("/:id/review", validate(reviewSchema), asyncHandler(bookingController.addReview));
bookingRoutes.post("/:id/cancel", asyncHandler(bookingController.cancelBooking));

