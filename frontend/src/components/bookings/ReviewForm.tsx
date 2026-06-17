import { useState } from "react";
import { Button } from "../common/Button";
import { StarRating } from "../common/StarRating";

type ReviewFormProps = {
  onSubmit: (values: { rating: number; comment?: string }) => void;
  isSubmitting: boolean;
};

export function ReviewForm({ onSubmit, isSubmitting }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  return (
    <div className="mt-4 rounded-xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-4 shadow-sm transition-colors duration-300">
      <p className="mb-2 text-sm font-bold text-slate-800 dark:text-slate-200">Add feedback</p>
      <div className="mb-3 flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} star rating`}>
            <StarRating rating={value <= rating ? 1 : 0} />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        className="min-h-20 w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition-all placeholder-slate-400 dark:placeholder-slate-500 focus:border-brand-navy/60 dark:focus:border-brand-blue/60 focus:ring-4 focus:ring-brand-navy/10 dark:focus:ring-brand-blue/15"
        placeholder="What went well?"
      />
      <Button className="mt-3 w-full" onClick={() => onSubmit({ rating, comment })} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Feedback"}
      </Button>
    </div>
  );
}
