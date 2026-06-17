import { describe, expect, it } from "vitest";
import { calculateNights } from "../../frontend/src/utils/date";

describe("Service Logic Edge Cases", () => {
  describe("Nights calculations on dates checks", () => {
    it("throws 0 nights if checkout matches checkin date exactly", () => {
      const nights = calculateNights("2026-06-20", "2026-06-20");
      expect(nights).toBe(0);
    });

    it("throws 0 nights if checkout date is before checkin date", () => {
      const nights = calculateNights("2026-06-22", "2026-06-20");
      expect(nights).toBe(0);
    });
  });

  describe("API Error Responses", () => {
    it("formats API standard response correctly", async () => {
      const { ApiError } = await import("../src/utils/ApiError.js");
      const err = new ApiError(400, "Bad Request message", ["Details here"]);
      expect(err.statusCode).toBe(400);
      expect(err.message).toBe("Bad Request message");
      expect(err.details).toEqual(["Details here"]);
    });
  });
});
