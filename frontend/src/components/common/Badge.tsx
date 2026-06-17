import type { ReactNode } from "react";
import clsx from "clsx";

type BadgeProps = {
  tone?: "success" | "warning" | "danger" | "neutral";
  children: ReactNode;
};

const tones = {
  success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  danger: "bg-red-500/10 text-brand-red dark:text-red-400",
  neutral: "bg-slate-500/10 text-slate-600 dark:text-slate-400"
};

export function Badge({ tone = "neutral", children }: BadgeProps) {
  return (
    <span className={clsx("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", tones[tone])}>
      {children}
    </span>
  );
}
