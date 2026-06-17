import { Star } from "lucide-react";
import clsx from "clsx";

export function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 rating`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={clsx(size === "md" ? "h-5 w-5" : "h-4 w-4", star <= rating ? "fill-brand-warning text-brand-warning" : "text-slate-300 dark:text-zinc-700")}
        />
      ))}
    </span>
  );
}
