import { describe, expect, it } from "vitest";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "../src/validators/auth.validator.js";
import { createRoomSchema, updateRoomSchema } from "../src/validators/room.validator.js";
import { reviewSchema } from "../src/validators/booking.validator.js";

describe("Backend Validators", () => {
  describe("registerSchema", () => {
    it("accepts a fully valid registration body", () => {
      const result = registerSchema.safeParse({
        body: {
          name: "Nidish Kumar",
          email: "nidish@example.com",
          password: "SecurePass@1234"
        }
      });
      expect(result.success).toBe(true);
    });

    it("rejects names shorter than 2 characters", () => {
      const result = registerSchema.safeParse({
        body: {
          name: "N",
          email: "nidish@example.com",
          password: "SecurePass@1234"
        }
      });
      expect(result.success).toBe(false);
    });

    it("rejects malformed email formats", () => {
      const result = registerSchema.safeParse({
        body: {
          name: "Nidish",
          email: "not-an-email",
          password: "SecurePass@1234"
        }
      });
      expect(result.success).toBe(false);
    });

    it("rejects weak passwords missing uppercase/lowercase/numbers/symbols", () => {
      const result1 = registerSchema.safeParse({
        body: { name: "Nidish", email: "nidish@example.com", password: "weakpassword" }
      });
      const result2 = registerSchema.safeParse({
        body: { name: "Nidish", email: "nidish@example.com", password: "WEAKPASSWORD123" }
      });
      expect(result1.success).toBe(false);
      expect(result2.success).toBe(false);
    });

    it("rejects passwords matching the common blacklist (e.g. hello, sunshines)", () => {
      const result = registerSchema.safeParse({
        body: {
          name: "Nidish",
          email: "nidish@example.com",
          password: "Hello" // blacklisted in commonPasswords
        }
      });
      expect(result.success).toBe(false);
    });
  });

  describe("loginSchema", () => {
    it("accepts correct structure and formats", () => {
      const result = loginSchema.safeParse({
        body: {
          email: "user@example.com",
          password: "Password@123"
        }
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing passwords or invalid emails", () => {
      const result = loginSchema.safeParse({
        body: {
          email: "not-email",
          password: ""
        }
      });
      expect(result.success).toBe(false);
    });
  });

  describe("forgotPasswordSchema", () => {
    it("validates email check is clean", () => {
      const result = forgotPasswordSchema.safeParse({
        body: { email: "valid@domain.com" }
      });
      expect(result.success).toBe(true);
    });
  });

  describe("resetPasswordSchema", () => {
    it("accepts valid token and strong password", () => {
      const result = resetPasswordSchema.safeParse({
        body: {
          token: "a".repeat(32),
          password: "StrongPass@1234"
        }
      });
      expect(result.success).toBe(true);
    });

    it("rejects short tokens", () => {
      const result = resetPasswordSchema.safeParse({
        body: {
          token: "short-token",
          password: "StrongPass@1234"
        }
      });
      expect(result.success).toBe(false);
    });
  });

  describe("createRoomSchema", () => {
    it("validates valid room configs", () => {
      const result = createRoomSchema.safeParse({
        body: {
          roomNumber: "405",
          type: "Presidential Suite",
          capacity: "4",
          pricePerNight: "15000",
          description: "Ultra luxury suite."
        }
      });
      expect(result.success).toBe(true);
    });

    it("rejects negative capacity or pricing configurations", () => {
      const result1 = createRoomSchema.safeParse({
        body: { roomNumber: "405", type: "Suite", capacity: "0", pricePerNight: "15000" }
      });
      const result2 = createRoomSchema.safeParse({
        body: { roomNumber: "405", type: "Suite", capacity: "2", pricePerNight: "-10" }
      });
      expect(result1.success).toBe(false);
      expect(result2.success).toBe(false);
    });
  });

  describe("reviewSchema", () => {
    it("accepts valid rating scale of 1-5", () => {
      const result = reviewSchema.safeParse({
        params: { id: "a2b3c4d5-e6f7-8901-2345-67890abcdef1" },
        body: { rating: 4, comment: "Nice service!" }
      });
      expect(result.success).toBe(true);
    });

    it("rejects ratings out of bounds", () => {
      const resultMin = reviewSchema.safeParse({
        params: { id: "a2b3c4d5-e6f7-8901-2345-67890abcdef1" },
        body: { rating: 0, comment: "" }
      });
      const resultMax = reviewSchema.safeParse({
        params: { id: "a2b3c4d5-e6f7-8901-2345-67890abcdef1" },
        body: { rating: 6, comment: "" }
      });
      expect(resultMin.success).toBe(false);
      expect(resultMax.success).toBe(false);
    });
  });
});
