import { describe, expect, it } from "vitest";
import { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "./auth.schema";

describe("Frontend Auth schemas", () => {
  describe("signupSchema", () => {
    it("validates successful data", () => {
      const result = signupSchema.safeParse({
        name: "Test Name",
        email: "test@domain.com",
        password: "PassWord@1234"
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid email formats", () => {
      const result = signupSchema.safeParse({
        name: "Test Name",
        email: "bad-email",
        password: "PassWord@1234"
      });
      expect(result.success).toBe(false);
    });

    it("rejects too short passwords", () => {
      const result = signupSchema.safeParse({
        name: "Test",
        email: "test@domain.com",
        password: "Short@1"
      });
      expect(result.success).toBe(false);
    });

    it("rejects common passwords", () => {
      const result = signupSchema.safeParse({
        name: "Test",
        email: "test@domain.com",
        password: "Welcome@123" // matches commonPasswords
      });
      expect(result.success).toBe(false);
    });
  });

  describe("loginSchema", () => {
    it("validates valid login data", () => {
      const result = loginSchema.safeParse({
        email: "login@domain.com",
        password: "anypassword"
      });
      expect(result.success).toBe(true);
    });
  });

  describe("forgotPasswordSchema", () => {
    it("requires a valid email shape", () => {
      const result = forgotPasswordSchema.safeParse({ email: "forgot@test.com" });
      expect(result.success).toBe(true);
    });
  });

  describe("resetPasswordSchema", () => {
    it("requires token to be at least 32 characters", () => {
      const result1 = resetPasswordSchema.safeParse({ token: "a".repeat(32), password: "PassWord@1234" });
      const result2 = resetPasswordSchema.safeParse({ token: "short-token", password: "PassWord@1234" });
      expect(result1.success).toBe(true);
      expect(result2.success).toBe(false);
    });
  });
});
