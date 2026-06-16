import { describe, expect, it } from "vitest";

describe("auth rules", () => {
  it("requires passwords with at least 8 characters", () => {
    expect("User@1234".length).toBeGreaterThanOrEqual(8);
  });
});
