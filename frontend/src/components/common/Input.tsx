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
      <label className="block text-left">
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={clsx(
              "min-h-11 w-full rounded-xl border border-slate-200/80 dark:border-zinc-700/60 bg-white/60 dark:bg-zinc-850/40 backdrop-blur-sm px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition-all placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white/95 dark:focus:bg-zinc-800/90 focus:border-brand-navy/60 dark:focus:border-brand-blue/60 focus:ring-4 focus:ring-brand-navy/10 dark:focus:ring-brand-blue/15",
              error && "border-brand-red focus:border-brand-red/60 focus:ring-brand-red/10",
              className,
            )}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              aria-label={visible ? "Hide password" : "Show password"}
              onClick={() => setVisible((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-lg p-1.5 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-750 hover:text-slate-600 dark:hover:text-slate-300 transition"
            >
              {visible ? (
                <EyeOff className="h-4.5 w-4.5" />
              ) : (
                <Eye className="h-4.5 w-4.5" />
              )}
            </button>
          ) : null}
        </div>
        {error ? (
          <span className="mt-1.5 block text-xs font-semibold text-brand-red animate-pulse">{error}</span>
        ) : null}
      </label>
    );
  },
);


Input.displayName = "Input";
