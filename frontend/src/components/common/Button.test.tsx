import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button component", () => {
  it("renders children text correctly", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("applies primary styles by default", () => {
    render(<Button>Primary Button</Button>);
    const button = screen.getByRole("button", { name: "Primary Button" });
    expect(button).toHaveClass("bg-brand-navy", "text-white");
  });

  it("applies secondary styles when specified", () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole("button", { name: "Secondary Button" });
    expect(button).toHaveClass("border-slate-200/80", "bg-white/70");
  });

  it("shows spinner loading indicator when isLoading is true", () => {
    render(<Button isLoading>Submit</Button>);
    const svg = document.querySelector("svg");
    expect(svg).toHaveClass("animate-spin");
  });

  it("is disabled when disabled prop is passed", () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole("button", { name: "Disabled Button" });
    expect(button).toBeDisabled();
  });
});
