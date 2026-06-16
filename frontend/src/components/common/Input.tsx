import { forwardRef, type InputHTMLAttributes, useState } from "react";
import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, type, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (visible ? "text" : "password") : type;

    return (
      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-slate-700">
          {label}
        </span>
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={clsx(
              "min-h-11 w-full rounded-md border border-brand-border bg-white px-3 py-2 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15",
              error && "border-brand-danger",
              className,
            )}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              aria-label={visible ? "Hide password" : "Show password"}
              onClick={() => setVisible((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded px-2 py-1 text-sm text-slate-500 hover:text-slate-700"
            >
              {visible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          ) : null}
        </div>
        {error ? (
          <span className="mt-1 block text-sm text-brand-danger">{error}</span>
        ) : null}
      </label>
    );
  },
);

Input.displayName = "Input";
