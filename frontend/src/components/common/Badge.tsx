import type { ReactNode } from "react";
import clsx from "clsx";

type BadgeProps = {
  tone?: "success" | "warning" | "danger" | "neutral";
  children: ReactNode;
};

const tones = {
  success: "bg-green-50 text-brand-success",
  warning: "bg-amber-50 text-brand-warning",
  danger: "bg-red-50 text-brand-danger",
  neutral: "bg-slate-100 text-slate-700"
};

export function Badge({ tone = "neutral", children }: BadgeProps) {
  return (
    <span className={clsx("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", tones[tone])}>
      {children}
    </span>
  );
}
