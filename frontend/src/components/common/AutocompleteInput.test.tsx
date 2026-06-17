import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AutocompleteInput } from "./AutocompleteInput";

describe("AutocompleteInput component", () => {
  const suggestions = ["Standard Room", "Deluxe Room", "Family Suite"];

  it("renders the input with label and helper text", () => {
    render(
      <AutocompleteInput
        label="Select Room Type"
        value=""
        onChange={vi.fn()}
        suggestions={suggestions}
      />
    );
    expect(screen.getByLabelText("Select Room Type")).toBeInTheDocument();
    expect(screen.getByText("Choose a suggestion or type your own.")).toBeInTheDocument();
  });

  it("opens suggestion list when input gains focus", () => {
    render(
      <AutocompleteInput
        label="Select Room Type"
        value=""
        onChange={vi.fn()}
        suggestions={suggestions}
      />
    );
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    suggestions.forEach((suggestion) => {
      expect(screen.getByRole("option", { name: suggestion })).toBeInTheDocument();
    });
  });

  it("calls onChange when a suggestion is clicked", () => {
    const handleChange = vi.fn();
    render(
      <AutocompleteInput
        label="Select Room Type"
        value=""
        onChange={handleChange}
        suggestions={suggestions}
      />
    );
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);

    const option = screen.getByRole("option", { name: "Deluxe Room" });
    fireEvent.click(option);

    expect(handleChange).toHaveBeenCalledWith("Deluxe Room");
  });

  it("filters suggestions based on user input", () => {
    render(
      <AutocompleteInput
        label="Select Room Type"
        value="Suite"
        onChange={vi.fn()}
        suggestions={suggestions}
      />
    );
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);

    // Only "Family Suite" matches "Suite"
    expect(screen.queryByRole("option", { name: "Standard Room" })).not.toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Deluxe Room" })).not.toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Family Suite" })).toBeInTheDocument();
  });
});
