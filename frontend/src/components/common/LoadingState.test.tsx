import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingState } from "./LoadingState";

describe("LoadingState component", () => {
  it("renders with the default loading message", () => {
    render(<LoadingState />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders with a custom loading message", () => {
    render(<LoadingState message="Fetching room data..." />);
    expect(screen.getByText("Fetching room data...")).toBeInTheDocument();
  });
});
