import request from "supertest";
import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { app } from "../src/app.js";
import { prisma } from "../src/config/prisma.js";

const testUser = {
  name: "Test User",
  email: `testuser+${Date.now()}@example.com`,
  password: "Str0ng!Pass",
};

const weakPassword = "password123";

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: testUser.email } });
  await prisma.$disconnect();
});

describe("Auth API endpoints", () => {
  it("should reject weak passwords on signup", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Weak Pass",
        email: `weakpass+${Date.now()}@example.com`,
        password: weakPassword,
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("Validation failed.");
  });

  it("should allow registration with a strong password", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("token");
    expect(response.body.data.user).toMatchObject({
      email: testUser.email,
      name: testUser.name,
    });
  });

  it("should reject duplicate registration safely", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Email is already registered.");
  });

  it("should login successfully with correct credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("token");
  });

  it("should reject login with incorrect password", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: "WrongP@ss1",
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid email or password.");
  });

  it("should return a generic forgot-password response for unknown email", async () => {
    const response = await request(app)
      .post("/api/auth/forgot-password")
      .send({
        email: `missing+${Date.now()}@example.com`
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "If this email exists, a password reset link would be sent.",
    );
  });
});
