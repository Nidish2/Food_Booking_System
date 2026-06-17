import { useEffect, useId, useMemo, useRef, useState } from "react";
import clsx from "clsx";

type AutocompleteInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  helperText?: string;
};

export function AutocompleteInput({
  label,
  value,
  onChange,
  suggestions,
  placeholder,
  error,
  disabled,
  className,
  helperText = "Choose a suggestion or type your own.",
}: AutocompleteInputProps) {
  const inputId = useId();
  const listId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const filteredSuggestions = useMemo(() => {
    const normalizedValue = value.trim().toLowerCase();
    const uniqueSuggestions = Array.from(
      new Set(
        suggestions.map((suggestion) => suggestion.trim()).filter(Boolean),
      ),
    );

    if (!normalizedValue) {
      return uniqueSuggestions.slice(0, 8);
    }

    return uniqueSuggestions
      .filter((suggestion) =>
        suggestion.toLowerCase().includes(normalizedValue),
      )
      .slice(0, 8);
  }, [suggestions, value]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <div ref={wrapperRef} className={clsx("relative block", className)}>
      <label
        htmlFor={inputId}
        className="mb-1 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={isOpen && filteredSuggestions.length > 0}
          aria-controls={listId}
          onFocus={() => setIsOpen(true)}
          onChange={(event) => {
            onChange(event.target.value);
            setIsOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsOpen(false);
            }
          }}
          className={clsx(
            "min-h-11 w-full rounded-md border border-brand-border bg-white px-3 py-2 outline-none transition placeholder:text-slate-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15",
            error && "border-brand-danger",
          )}
        />
        {isOpen && filteredSuggestions.length > 0 && !disabled ? (
          <div
            id={listId}
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 max-h-56 overflow-auto rounded-xl border border-slate-200 bg-white p-1 shadow-2xl"
          >
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                role="option"
                aria-selected={suggestion === value}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(suggestion);
                  setIsOpen(false);
                }}
                className={clsx(
                  "flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition hover:bg-brand-light",
                  suggestion === value
                    ? "bg-brand-light text-brand-navy"
                    : "text-slate-700",
                )}
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {helperText ? (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      ) : null}
      {error ? (
        <span className="mt-1 block text-sm text-brand-danger">{error}</span>
      ) : null}
    </div>
  );
}
