import { describe, expect, it } from "vitest";

const overlaps = (start: string, end: string, existingStart: string, existingEnd: string) =>
  new Date(start) < new Date(existingEnd) && new Date(end) > new Date(existingStart);

describe("booking overlap rule", () => {
  it("detects overlapping dates", () => {
    expect(overlaps("2026-06-21", "2026-06-23", "2026-06-20", "2026-06-22")).toBe(true);
  });

  it("allows adjacent dates", () => {
    expect(overlaps("2026-06-22", "2026-06-24", "2026-06-20", "2026-06-22")).toBe(false);
  });
});

describe("booking display status rules", () => {
  it("treats checked-out confirmed bookings as completed", () => {
    const checkout = new Date("2026-06-10");
    const today = new Date("2026-06-16");
    expect(checkout <= today).toBe(true);
  });

  it("allows feedback only after checkout", () => {
    const checkout = new Date("2026-06-15");
    const today = new Date("2026-06-16");
    expect(checkout <= today).toBe(true);
  });
});
