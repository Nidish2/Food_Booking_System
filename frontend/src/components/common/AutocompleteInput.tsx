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
        className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
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
            "min-h-11 w-full rounded-xl border border-slate-200/80 dark:border-zinc-700/60 bg-white/60 dark:bg-zinc-850/40 backdrop-blur-sm px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition-all placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white/95 dark:focus:bg-zinc-800/90 focus:border-brand-navy/60 dark:focus:border-brand-blue/60 focus:ring-4 focus:ring-brand-navy/10 dark:focus:ring-brand-blue/15",
            error && "border-brand-red focus:border-brand-red/60 focus:ring-brand-red/10",
          )}
        />
        {isOpen && filteredSuggestions.length > 0 && !disabled ? (
          <div
            id={listId}
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 max-h-56 overflow-auto rounded-xl border border-slate-200/60 dark:border-zinc-700/60 bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md p-1 shadow-2xl"
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
                  "flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition hover:bg-slate-100 dark:hover:bg-zinc-700/50",
                  suggestion === value
                    ? "bg-slate-100 dark:bg-zinc-700 text-brand-navy dark:text-white"
                    : "text-slate-700 dark:text-slate-200",
                )}
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {helperText ? (
        <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">{helperText}</p>
      ) : null}
      {error ? (
        <span className="mt-1.5 block text-xs font-semibold text-brand-red animate-pulse">{error}</span>
      ) : null}
    </div>
  );
}
