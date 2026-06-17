import { describe, expect, it } from "vitest";
import { bookingSchema } from "./booking.schema";

describe("Frontend Booking schema", () => {
  it("accepts valid booking data with future dates", () => {
    // Generate future dates to ensure validation passes
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + 2); // 2 days in future
    const checkOut = new Date();
    checkOut.setDate(checkOut.getDate() + 4); // 4 days in future

    const result = bookingSchema.safeParse({
      guestName: "Nidish",
      guestEmail: "nidish@example.com",
      checkInDate: checkIn.toISOString().split("T")[0],
      checkOutDate: checkOut.toISOString().split("T")[0]
    });
    expect(result.success).toBe(true);
  });

  it("rejects guest name shorter than 2 chars", () => {
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + 2);
    const checkOut = new Date();
    checkOut.setDate(checkOut.getDate() + 4);

    const result = bookingSchema.safeParse({
      guestName: "N",
      guestEmail: "nidish@example.com",
      checkInDate: checkIn.toISOString().split("T")[0],
      checkOutDate: checkOut.toISOString().split("T")[0]
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email format", () => {
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + 2);
    const checkOut = new Date();
    checkOut.setDate(checkOut.getDate() + 4);

    const result = bookingSchema.safeParse({
      guestName: "Nidish",
      guestEmail: "bad-email",
      checkInDate: checkIn.toISOString().split("T")[0],
      checkOutDate: checkOut.toISOString().split("T")[0]
    });
    expect(result.success).toBe(false);
  });

  it("rejects check-in date in the past", () => {
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() - 2); // 2 days in past
    const checkOut = new Date();
    checkOut.setDate(checkOut.getDate() + 2);

    const result = bookingSchema.safeParse({
      guestName: "Nidish",
      guestEmail: "nidish@example.com",
      checkInDate: checkIn.toISOString().split("T")[0],
      checkOutDate: checkOut.toISOString().split("T")[0]
    });
    expect(result.success).toBe(false);
  });

  it("rejects checkout date before check-in date", () => {
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + 5);
    const checkOut = new Date();
    checkOut.setDate(checkOut.getDate() + 2); // checkout is before checkin

    const result = bookingSchema.safeParse({
      guestName: "Nidish",
      guestEmail: "nidish@example.com",
      checkInDate: checkIn.toISOString().split("T")[0],
      checkOutDate: checkOut.toISOString().split("T")[0]
    });
    expect(result.success).toBe(false);
  });
});
