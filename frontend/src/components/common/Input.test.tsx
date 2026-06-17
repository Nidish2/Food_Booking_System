import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "./Input";

describe("Input component", () => {
  it("renders the input label and placeholder correctly", () => {
    render(<Input label="Test Label" placeholder="Test Placeholder" />);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Test Placeholder")).toBeInTheDocument();
  });

  it("displays the error message if provided", () => {
    render(<Input label="Username" error="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("toggles password visibility when toggle button is clicked", () => {
    render(<Input label="Password" type="password" placeholder="Enter password" />);
    const input = screen.getByPlaceholderText("Enter password") as HTMLInputElement;
    expect(input.type).toBe("password");

    const toggleButton = screen.getByRole("button", { name: "Show password" });
    fireEvent.click(toggleButton);
    expect(input.type).toBe("text");

    fireEvent.click(screen.getByRole("button", { name: "Hide password" }));
    expect(input.type).toBe("password");
  });
});
