import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "../src/utils/ApiError.js";

const mocks = vi.hoisted(() => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn()
    },
    room: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn()
    },
    booking: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn()
    },
    review: {
      create: vi.fn()
    },
    $transaction: vi.fn()
  },
  isPwnedPassword: vi.fn()
}));

vi.mock("../src/config/prisma.js", () => ({ prisma: mocks.prisma }));
vi.mock("../src/utils/passwordStrength.js", () => ({
  isPwnedPassword: mocks.isPwnedPassword,
  validatePasswordStrength: vi.fn()
}));

const { authService } = await import("../src/services/auth.service.js");
const { bookingService } = await import("../src/services/booking.service.js");
const { roomService } = await import("../src/services/room.service.js");

const resetMocks = () => {
  for (const model of Object.values(mocks.prisma)) {
    if (typeof model === "function") {
      model.mockReset();
      continue;
    }

    for (const method of Object.values(model)) {
      if (typeof method === "function") {
        method.mockReset();
      }
    }
  }
  mocks.isPwnedPassword.mockReset();
  mocks.isPwnedPassword.mockResolvedValue(false);
};

describe("auth workflow", () => {
  beforeEach(resetMocks);

  it("registers a new user with a sanitized response and token", async () => {
    mocks.prisma.user.findUnique.mockResolvedValue(null);
    mocks.prisma.user.create.mockResolvedValue({
      id: "user-1",
      name: "Nidish",
      email: "nidish@example.com",
      role: "USER"
    });

    const result = await authService.register({
      name: "Nidish",
      email: "nidish@example.com",
      password: "Strong@123"
    });

    expect(result.user).toEqual({
      id: "user-1",
      name: "Nidish",
      email: "nidish@example.com",
      role: "USER"
    });
    expect(result.token).toEqual(expect.any(String));
    expect(result).not.toHaveProperty("passwordHash");
  });

  it("rejects duplicate signup emails", async () => {
    mocks.prisma.user.findUnique.mockResolvedValue({ id: "existing-user" });

    await expect(
      authService.register({
        name: "Nidish",
        email: "nidish@example.com",
        password: "Strong@123"
      })
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  it("uses a generic invalid login message", async () => {
    mocks.prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      authService.login({ email: "missing@example.com", password: "whatever" })
    ).rejects.toMatchObject({ statusCode: 401, message: "Invalid email or password." });
  });

  it("forgot-password request does not directly update passwords", async () => {
    mocks.prisma.user.findUnique.mockResolvedValue(null);

    await authService.forgotPassword({ email: "anyone@example.com" });

    expect(mocks.prisma.user.update).not.toHaveBeenCalled();
  });
});

describe("room workflow", () => {
  beforeEach(resetMocks);

  it("creates a room when the room number is unique", async () => {
    mocks.prisma.room.findUnique.mockResolvedValue(null);
    mocks.prisma.room.create.mockResolvedValue({ id: "room-101", roomNumber: "101" });

    const room = await roomService.createRoom(
      {
        roomNumber: "101",
        type: "Deluxe King",
        capacity: 2,
        pricePerNight: 3200,
        description: "Comfortable room"
      },
      "admin-1"
    );

    expect(room).toEqual({ id: "room-101", roomNumber: "101" });
    expect(mocks.prisma.room.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ roomNumber: "101", createdById: "admin-1" })
      })
    );
  });

  it("rejects duplicate room numbers", async () => {
    mocks.prisma.room.findUnique.mockResolvedValue({ id: "room-existing" });

    await expect(
      roomService.createRoom(
        {
          roomNumber: "101",
          type: "Deluxe King",
          capacity: 2,
          pricePerNight: 3200,
          description: ""
        },
        "admin-1"
      )
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  it("builds date-based availability filters instead of using static availability", async () => {
    mocks.prisma.room.findMany.mockResolvedValue([]);

    await roomService.listRooms({
      checkInDate: "2026-06-20",
      checkOutDate: "2026-06-22",
      type: "Suite",
      capacity: "3",
      minPrice: "2000",
      maxPrice: "6000"
    });

    expect(mocks.prisma.room.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          type: { contains: "Suite", mode: "insensitive" },
          capacity: { gte: 3 },
          bookings: expect.objectContaining({
            none: expect.objectContaining({ status: "CONFIRMED" })
          })
        })
      })
    );
  });
});

describe("booking workflow", () => {
  beforeEach(resetMocks);

  it("creates a booking when no dates overlap", async () => {
    const tx = {
      room: { findUnique: vi.fn().mockResolvedValue({ id: "room-1", pricePerNight: "1000" }) },
      booking: {
        findFirst: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({ id: "booking-1", totalAmount: "2000" })
      }
    };
    mocks.prisma.$transaction.mockImplementation((callback) => callback(tx));

    const booking = await bookingService.createBooking(
      {
        roomId: "room-1",
        guestName: "Nidish",
        guestEmail: "nidish@example.com",
        checkInDate: "2026-06-20",
        checkOutDate: "2026-06-22"
      },
      "user-1"
    );

    expect(booking).toEqual({ id: "booking-1", totalAmount: "2000" });
    expect(tx.booking.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          roomId: "room-1",
          checkInDate: { lt: new Date("2026-06-22T00:00:00.000Z") },
          checkOutDate: { gt: new Date("2026-06-20T00:00:00.000Z") }
        })
      })
    );
  });

  it("rejects overlapping booking dates with 409 conflict", async () => {
    const tx = {
      room: { findUnique: vi.fn().mockResolvedValue({ id: "room-1", pricePerNight: "1000" }) },
      booking: {
        findFirst: vi.fn().mockResolvedValue({ id: "existing-booking" }),
        create: vi.fn()
      }
    };
    mocks.prisma.$transaction.mockImplementation((callback) => callback(tx));

    await expect(
      bookingService.createBooking(
        {
          roomId: "room-1",
          guestName: "Nidish",
          guestEmail: "nidish@example.com",
          checkInDate: "2026-06-20",
          checkOutDate: "2026-06-22"
        },
        "user-1"
      )
    ).rejects.toMatchObject({ statusCode: 409 });
    expect(tx.booking.create).not.toHaveBeenCalled();
  });

  it("filters booking history by active/completed statuses", async () => {
    mocks.prisma.booking.findMany.mockResolvedValue([]);

    await bookingService.getBookingHistory("admin-1", "ADMIN", "ACTIVE");
    await bookingService.getBookingHistory("user-1", "USER", "COMPLETED");

    expect(mocks.prisma.booking.findMany).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: expect.objectContaining({ status: "CONFIRMED" })
      })
    );
    expect(mocks.prisma.booking.findMany).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        where: expect.objectContaining({ userId: "user-1", status: "CONFIRMED" })
      })
    );
  });

  it("allows feedback only for the booking owner after checkout", async () => {
    mocks.prisma.booking.findUnique.mockResolvedValue({
      id: "booking-1",
      roomId: "room-1",
      userId: "user-1",
      checkOutDate: new Date("2026-06-01T00:00:00.000Z"),
      review: null
    });
    mocks.prisma.review.create.mockResolvedValue({ id: "review-1", rating: 5 });

    const review = await bookingService.addReview("booking-1", "user-1", {
      rating: 5,
      comment: "Great stay"
    });

    expect(review).toEqual({ id: "review-1", rating: 5 });
  });

  it("rejects feedback from a different user", async () => {
    mocks.prisma.booking.findUnique.mockResolvedValue({
      id: "booking-1",
      userId: "owner-user",
      checkOutDate: new Date("2026-06-01T00:00:00.000Z"),
      review: null
    });

    await expect(
      bookingService.addReview("booking-1", "other-user", { rating: 5, comment: "Nope" })
    ).rejects.toBeInstanceOf(ApiError);
  });
});
