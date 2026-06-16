import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { bookingStatus } from "../constants/bookingStatus.js";
import { httpStatus } from "../constants/httpStatus.js";
import type { CreateBookingInput, ReviewInput } from "../validators/booking.validator.js";
import { ApiError } from "../utils/ApiError.js";
import { calculateNights, getTodayUtc, toDateOnly } from "../utils/date.js";

export const bookingService = {
  async createBooking(input: CreateBookingInput, userId: string) {
    const checkInDate = toDateOnly(input.checkInDate);
    const checkOutDate = toDateOnly(input.checkOutDate);
    const today = getTodayUtc();

    if (checkInDate < today) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Check-in date cannot be in the past.");
    }

    if (checkOutDate <= checkInDate) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Check-out date must be after check-in date.");
    }

    return prisma.$transaction(async (tx) => {
      const room = await tx.room.findUnique({ where: { id: input.roomId } });
      if (!room) {
        throw new ApiError(httpStatus.NOT_FOUND, "Room not found.");
      }

      const conflictingBooking = await tx.booking.findFirst({
        where: {
          roomId: input.roomId,
          status: bookingStatus.CONFIRMED,
          checkInDate: { lt: checkOutDate },
          checkOutDate: { gt: checkInDate }
        }
      });

      if (conflictingBooking) {
        throw new ApiError(httpStatus.CONFLICT, "This room is already booked for the selected dates.");
      }

      const nights = calculateNights(checkInDate, checkOutDate);
      const totalAmount = new Prisma.Decimal(room.pricePerNight).mul(nights);

      return tx.booking.create({
        data: {
          roomId: input.roomId,
          userId,
          guestName: input.guestName,
          guestEmail: input.guestEmail,
          checkInDate,
          checkOutDate,
          totalAmount,
          status: bookingStatus.CONFIRMED
        },
        include: { room: true, review: true }
      });
    });
  },

  async getMyBookings(userId: string) {
    return prisma.booking.findMany({
      where: { userId },
      include: { room: { include: { reviews: true } }, review: true },
      orderBy: { createdAt: "desc" }
    });
  },

  async getBookingHistory(userId: string, role: "USER" | "ADMIN", status?: string) {
    const today = getTodayUtc();
    const statusWhere =
      status === "UPCOMING"
        ? { checkInDate: { gt: today }, status: bookingStatus.CONFIRMED }
        : status === "ACTIVE"
          ? { checkInDate: { lte: today }, checkOutDate: { gt: today }, status: bookingStatus.CONFIRMED }
          : status === "COMPLETED"
            ? { checkOutDate: { lte: today }, status: bookingStatus.CONFIRMED }
            : status === "CANCELLED"
              ? { status: bookingStatus.CANCELLED }
              : {};

    return prisma.booking.findMany({
      where: {
        ...(role === "ADMIN" ? {} : { userId }),
        ...statusWhere
      },
      include: {
        room: { include: { reviews: true } },
        review: true,
        user: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: "desc" }
    });
  },

  async addReview(bookingId: string, userId: string, input: ReviewInput) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { review: true }
    });

    if (!booking || booking.userId !== userId) {
      throw new ApiError(httpStatus.NOT_FOUND, "Booking not found.");
    }

    if (booking.review) {
      throw new ApiError(httpStatus.CONFLICT, "Feedback already submitted for this booking.");
    }

    if (booking.checkOutDate > getTodayUtc()) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Feedback can be added after checkout.");
    }

    return prisma.review.create({
      data: {
        bookingId,
        roomId: booking.roomId,
        userId,
        rating: input.rating,
        comment: input.comment || null
      }
    });
  }
};
