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
    <div className="mt-4 rounded-md border border-brand-border bg-white p-3">
      <p className="mb-2 text-sm font-semibold text-brand-navy">Add feedback</p>
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
        className="min-h-20 w-full rounded-md border border-brand-border px-3 py-2 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15"
        placeholder="What went well?"
      />
      <Button className="mt-3" onClick={() => onSubmit({ rating, comment })} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Feedback"}
      </Button>
    </div>
  );
}
