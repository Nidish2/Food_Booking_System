import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  isLoading?: boolean;
  children: ReactNode;
};

const variants = {
  primary: "bg-brand-navy dark:bg-brand-blue text-white hover:bg-brand-navy/95 dark:hover:bg-brand-blue/95 shadow-md shadow-brand-navy/10 dark:shadow-brand-blue/20 focus:ring-brand-navy/20 dark:focus:ring-brand-blue/30",
  secondary: "border border-slate-200/80 dark:border-zinc-700/60 bg-white/70 dark:bg-zinc-800/40 backdrop-blur-sm text-slate-800 dark:text-slate-200 hover:bg-slate-50/90 dark:hover:bg-zinc-800/70 focus:ring-slate-100 dark:focus:ring-zinc-800",
  danger: "bg-brand-red text-white hover:bg-brand-red/95 shadow-md shadow-brand-red/10 focus:ring-brand-red/20 dark:focus:ring-brand-red/35",
  ghost: "text-slate-800 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-zinc-800/80 focus:ring-slate-100 dark:focus:ring-zinc-800"
};

export function Button({ variant = "primary", isLoading = false, className, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={clsx(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-offset-1 hover:scale-[1.01] active:scale-[0.99] disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-60 btn-click-shine",
        variants[variant],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <svg className="h-4 w-4 animate-spin text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : null}
      <span>{children}</span>
    </button>
  );
}

