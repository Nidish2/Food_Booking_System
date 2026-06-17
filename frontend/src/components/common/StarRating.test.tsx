import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StarRating } from "./StarRating";

describe("StarRating component", () => {
  it("renders correctly with specified rating", () => {
    render(<StarRating rating={3} />);
    const container = screen.getByLabelText("3 out of 5 rating");
    expect(container).toBeInTheDocument();
  });

  it("highlights the correct number of stars", () => {
    const { container } = render(<StarRating rating={4} />);
    // There should be 4 stars with the fill-brand-warning class
    const filledStars = container.querySelectorAll(".fill-brand-warning");
    expect(filledStars.length).toBe(4);
  });
});
