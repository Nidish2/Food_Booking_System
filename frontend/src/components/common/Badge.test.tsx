import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge component", () => {
  it("renders correctly with default tone", () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText("Default Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-slate-100", "text-slate-700");
  });

  it("renders correctly with success tone", () => {
    render(<Badge tone="success">Success Badge</Badge>);
    const badge = screen.getByText("Success Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-green-50", "text-brand-success");
  });
});
