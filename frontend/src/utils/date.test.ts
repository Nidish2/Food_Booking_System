import { describe, expect, it } from "vitest";
import { calculateNights, formatDate } from "./date";

describe("Date utilities", () => {
  describe("formatDate", () => {
    it("formats a standard ISO date string to medium date style", () => {
      // Inputting a specific date
      const dateStr = "2026-06-18";
      // We expect it to format to "18 Jun 2026" or similar depending on Intl settings
      const result = formatDate(dateStr);
      expect(result).toContain("Jun");
      expect(result).toContain("2026");
      expect(result).toContain("18");
    });
  });

  describe("calculateNights", () => {
    it("returns 0 if either date is missing", () => {
      expect(calculateNights()).toBe(0);
      expect(calculateNights("2026-06-18")).toBe(0);
      expect(calculateNights(undefined, "2026-06-19")).toBe(0);
    });

    it("calculates the correct number of nights between two dates", () => {
      expect(calculateNights("2026-06-18", "2026-06-19")).toBe(1);
      expect(calculateNights("2026-06-18", "2026-06-25")).toBe(7);
    });

    it("returns 0 or positive floor if checkout is before checkin", () => {
      expect(calculateNights("2026-06-19", "2026-06-18")).toBe(0);
    });
  });
});
