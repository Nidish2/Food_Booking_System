import request from "supertest";
import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { prisma } from "../src/config/prisma.js";

const unique = Date.now();
const userEmail = `api-user+${unique}@example.com`;
const userPassword = "Str0ng!Pass";

const extractCookie = (response: Awaited<ReturnType<typeof request>> | any) => {
  const setCookie = response.headers["set-cookie"];
  return Array.isArray(setCookie) && setCookie.length > 0 ? setCookie[0].split(";")[0] : "";
};

const adminCredentials = {
  email: `admin+${unique}@hotel.com`,
  password: "Admin@123"
};

const guestCredentials = {
  email: userEmail,
  password: userPassword
};

beforeAll(async () => {
  await prisma.$connect();
  await prisma.user.deleteMany({ where: { email: { in: [userEmail, adminCredentials.email] } } });
  await prisma.booking.deleteMany({
    where: {
      OR: [
        { guestEmail: userEmail },
        { room: { roomNumber: "101" } },
        { room: { roomNumber: "111" } }
      ]
    }
  });
  await prisma.room.deleteMany({ where: { roomNumber: { in: ["101", "111"] } } });

  const { hashPassword } = await import("../src/utils/password.js");
  const passwordHash = await hashPassword(adminCredentials.password);

  const admin = await prisma.user.create({
    data: {
      name: "Test Admin",
      email: adminCredentials.email,
      passwordHash,
      role: "ADMIN"
    }
  });

  await prisma.room.create({
    data: {
      roomNumber: "101",
      type: "Deluxe King",
      capacity: 2,
      pricePerNight: 3200,
      description: "Test room",
      createdById: admin.id
    }
  });
});

afterAll(async () => {
  await prisma.booking.deleteMany({
    where: {
      OR: [
        { guestEmail: userEmail },
        { room: { roomNumber: "101" } },
        { room: { roomNumber: "111" } }
      ]
    }
  });
  await prisma.room.deleteMany({
    where: { roomNumber: "111" }
  });
  await prisma.user.deleteMany({ where: { email: userEmail } });
  await prisma.$disconnect();
});

describe("API workflow coverage", () => {
  it("rejects unauthenticated access to protected routes", async () => {
    const response = await request(app).get("/api/rooms");
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authentication required.");
  });

  it("signs up a guest and logs them in", async () => {
    const register = await request(app).post("/api/auth/register").send({
      name: "API Guest",
      email: guestCredentials.email,
      password: guestCredentials.password
    });

    expect(register.status).toBe(201);
    expect(register.body.data.user.email).toBe(guestCredentials.email);

    const login = await request(app).post("/api/auth/login").send({
      email: guestCredentials.email,
      password: guestCredentials.password
    });

    expect(login.status).toBe(200);
    expect(login.body.data.user.email).toBe(guestCredentials.email);
    expect(extractCookie(login)).toContain("token=");
  });

  it("supports logout as a clean end-to-end auth flow", async () => {
    const login = await request(app).post("/api/auth/login").send(adminCredentials);
    const cookie = extractCookie(login);

    const response = await request(app).post("/api/auth/logout").set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Logout successful.");
  });

  it("allows admin to create and edit rooms while normal users are blocked", async () => {
    const adminLogin = await request(app).post("/api/auth/login").send(adminCredentials);
    const adminCookie = extractCookie(adminLogin);

    const userLogin = await request(app).post("/api/auth/login").send(guestCredentials);
    const userCookie = extractCookie(userLogin);

    const roomResponse = await request(app)
      .post("/api/rooms")
      .set("Cookie", adminCookie)
      .send({
        roomNumber: "111",
        type: "Deluxe King",
        capacity: 2,
        pricePerNight: 3200,
        description: "API test room"
      });

    expect(roomResponse.status).toBe(201);
    expect(roomResponse.body.data.room.roomNumber).toBe("111");

    const duplicateResponse = await request(app)
      .post("/api/rooms")
      .set("Cookie", adminCookie)
      .send({
        roomNumber: "111",
        type: "Suite",
        capacity: 3,
        pricePerNight: 4000,
        description: "Duplicate"
      });

    expect(duplicateResponse.status).toBe(409);
    expect(duplicateResponse.body.message).toBe("Room number already exists.");

    const forbiddenResponse = await request(app)
      .post("/api/rooms")
      .set("Cookie", userCookie)
      .send({
        roomNumber: "102",
        type: "Suite",
        capacity: 3,
        pricePerNight: 4000,
        description: "Not allowed"
      });

    expect(forbiddenResponse.status).toBe(403);
    expect(forbiddenResponse.body.message).toBe("Admin access required.");

    const editResponse = await request(app)
      .patch(`/api/rooms/${roomResponse.body.data.room.id}`)
      .set("Cookie", adminCookie)
      .send({
        pricePerNight: 3500,
        capacity: 3
      });

    expect(editResponse.status).toBe(200);
    expect(editResponse.body.data.room.pricePerNight).toBe("3500");
  }, 15000);

  it("books a room, blocks overlap, and returns user history", async () => {
    const userLogin = await request(app).post("/api/auth/login").send(guestCredentials);
    const userCookie = extractCookie(userLogin);

    const room = await prisma.room.findUnique({ where: { roomNumber: "101" } });
    expect(room).not.toBeNull();

    const bookingResponse = await request(app)
      .post("/api/bookings")
      .set("Cookie", userCookie)
      .send({
        roomId: room!.id,
        guestName: "API Guest",
        guestEmail: guestCredentials.email,
        checkInDate: "2026-06-20",
        checkOutDate: "2026-06-22"
      });

    expect(bookingResponse.status).toBe(201);
    expect(bookingResponse.body.data.booking.roomId).toBe(room!.id);

    const overlapResponse = await request(app)
      .post("/api/bookings")
      .set("Cookie", userCookie)
      .send({
        roomId: room!.id,
        guestName: "API Guest",
        guestEmail: guestCredentials.email,
        checkInDate: "2026-06-21",
        checkOutDate: "2026-06-23"
      });

    expect(overlapResponse.status).toBe(409);
    expect(overlapResponse.body.message).toBe("This room is already booked for the selected dates.");

    const historyResponse = await request(app)
      .get("/api/bookings/my")
      .set("Cookie", userCookie);

    expect(historyResponse.status).toBe(200);
    expect(Array.isArray(historyResponse.body.data.bookings)).toBe(true);
    expect(historyResponse.body.data.bookings.length).toBeGreaterThan(0);
  }, 15000);

  it("lets admins see all users and all bookings", async () => {
    const adminLogin = await request(app).post("/api/auth/login").send(adminCredentials);
    const adminCookie = extractCookie(adminLogin);

    const usersResponse = await request(app).get("/api/users").set("Cookie", adminCookie);
    expect(usersResponse.status).toBe(200);
    expect(Array.isArray(usersResponse.body.data.users)).toBe(true);

    const bookingsResponse = await request(app)
      .get("/api/bookings/history?status=ALL")
      .set("Cookie", adminCookie);
    expect(bookingsResponse.status).toBe(200);
    expect(Array.isArray(bookingsResponse.body.data.bookings)).toBe(true);
  }, 15000);
});
