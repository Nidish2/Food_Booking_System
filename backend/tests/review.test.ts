import request from "supertest";
import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { prisma } from "../src/config/prisma.js";

const unique = Date.now();
const userEmail = `review-user+${unique}@example.com`;
const userPassword = "Str0ng!Pass";

const extractCookie = (response: Awaited<ReturnType<typeof request>> | any) => {
  const setCookie = response.headers["set-cookie"];
  return Array.isArray(setCookie) && setCookie.length > 0 ? setCookie[0].split(";")[0] : "";
};

const adminCredentials = {
  email: "nidish2207@gmail.com",
  password: "Password@123"
};

const guestCredentials = {
  email: userEmail,
  password: userPassword
};

let roomId: string;
let bookingId: string;

beforeAll(async () => {
  await prisma.$connect();
  // Clear any existing user with this email
  await prisma.user.deleteMany({ where: { email: { in: [userEmail, adminCredentials.email] } } });

  const { hashPassword } = await import("../src/utils/password.js");
  const passwordHash = await hashPassword(adminCredentials.password);

  const admin = await prisma.user.create({
    data: {
      name: "Review Test Admin",
      email: adminCredentials.email,
      passwordHash,
      role: "ADMIN"
    }
  });

  const room = await prisma.room.create({
    data: {
      roomNumber: `R-${unique}`,
      type: "Deluxe",
      capacity: 2,
      pricePerNight: 2000,
      description: "Test Room",
      createdById: admin.id
    }
  });
  roomId = room.id;
});

afterAll(async () => {
  if (bookingId) {
    await prisma.review.deleteMany({ where: { bookingId } });
    await prisma.booking.deleteMany({ where: { id: bookingId } });
  }
  if (roomId) {
    await prisma.room.deleteMany({ where: { id: roomId } });
  }
  await prisma.user.deleteMany({ where: { email: userEmail } });
  await prisma.$disconnect();
});

describe("Review API workflow", () => {
  let userCookie: string;

  it("should setup user and booking for review", async () => {
    // Register and login user
    await request(app).post("/api/auth/register").send({
      name: "Review Guest",
      email: guestCredentials.email,
      password: guestCredentials.password
    });

    const login = await request(app).post("/api/auth/login").send(guestCredentials);
    userCookie = extractCookie(login);
    const userId = login.body.data.user.id;

    // Create a past booking (completed) using Prisma directly because the API rejects past check-in dates
    const pastBooking = await prisma.booking.create({
      data: {
        roomId,
        userId,
        guestName: "Review Guest",
        guestEmail: guestCredentials.email,
        checkInDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        checkOutDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        totalAmount: "4000.00",
        status: "CONFIRMED"
      }
    });

    bookingId = pastBooking.id;
  });

  it("should successfully add a review to a completed booking", async () => {
    const reviewResponse = await request(app)
      .post(`/api/bookings/${bookingId}/review`)
      .set("Cookie", userCookie)
      .send({
        rating: 5,
        comment: "Great stay, very clean!"
      });

    expect(reviewResponse.status).toBe(201);
    expect(reviewResponse.body.data.review.rating).toBe(5);
    expect(reviewResponse.body.data.review.comment).toBe("Great stay, very clean!");
  });

  it("should fail to add a duplicate review", async () => {
    const duplicateReview = await request(app)
      .post(`/api/bookings/${bookingId}/review`)
      .set("Cookie", userCookie)
      .send({
        rating: 4,
        comment: "Another review attempt"
      });

    expect(duplicateReview.status).toBe(409); // Conflict because already reviewed
  });

  it("should fail validation if rating is invalid", async () => {
    const invalidReview = await request(app)
      .post(`/api/bookings/${bookingId}/review`)
      .set("Cookie", userCookie)
      .send({
        rating: 6, // Max is 5 usually
        comment: "Too high rating"
      });

    expect(invalidReview.status).toBe(400);
  });
});
