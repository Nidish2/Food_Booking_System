import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  children: ReactNode;
};

const variants = {
  primary: "bg-brand-blue text-white hover:bg-brand-navy",
  secondary: "border border-brand-border bg-white text-brand-navy hover:bg-brand-light",
  danger: "bg-brand-danger text-white hover:bg-red-800",
  ghost: "text-brand-navy hover:bg-white/10"
};

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
