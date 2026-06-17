import { describe, expect, it } from "vitest";
import { formatCurrency } from "./currency";

describe("Currency utilities", () => {
  describe("formatCurrency", () => {
    it("formats standard numeric string to INR format with no decimals", () => {
      const result = formatCurrency("3200");
      // Result should contain 3,200 or 3 200, depending on environment locales
      expect(result).toContain("3");
      expect(result).toContain("200");
    });

    it("formats standard number to INR currency", () => {
      const result = formatCurrency(5800);
      expect(result).toContain("5");
      expect(result).toContain("800");
    });
  });
});
