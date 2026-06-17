import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./EmptyState";

describe("EmptyState component", () => {
  it("renders the title and message props correctly", () => {
    render(<EmptyState title="No Rooms Available" message="Please adjust your date filters." />);
    expect(screen.getByText("No Rooms Available")).toBeInTheDocument();
    expect(screen.getByText("Please adjust your date filters.")).toBeInTheDocument();
  });
});
