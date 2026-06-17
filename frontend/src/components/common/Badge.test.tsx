import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge component", () => {
  it("renders correctly with default tone", () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText("Default Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-slate-500/10", "text-slate-600");
  });

  it("renders correctly with success tone", () => {
    render(<Badge tone="success">Success Badge</Badge>);
    const badge = screen.getByText("Success Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-emerald-500/10", "text-emerald-700");
  });
});
