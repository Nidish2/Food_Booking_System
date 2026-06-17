import { X } from "lucide-react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import type { Room } from "../../types/room.types";
import { Button } from "../common/Button";
import { StarRating } from "../common/StarRating";

type RoomReviewsModalProps = {
  room: Room;
  onClose: () => void;
};

export function RoomReviewsModal({ room, onClose }: RoomReviewsModalProps) {
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.96, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 15 }}
        transition={{ type: "spring", stiffness: 350, damping: 26 }}
        className="w-full max-w-2xl rounded-2xl bg-white/80 dark:bg-zinc-900/75 backdrop-blur-md p-6 shadow-2xl max-h-[90vh] flex flex-col border border-white/20 dark:border-white/10"
      >
        <div className="flex items-center justify-between border-b border-slate-50 dark:border-zinc-800 pb-4 mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-brand-navy dark:text-white tracking-tight">Reviews for Room {room.roomNumber}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{room.type} • {room.capacity} guests</p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-600 dark:hover:text-slate-200 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {!room.reviews || room.reviews.length === 0 ? (
            <p className="text-center text-slate-400 dark:text-slate-500 py-12 italic text-sm">No feedback yet for this room.</p>
          ) : (
            room.reviews.map((review) => (
              <div key={review.id} className="rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/10 dark:bg-zinc-800/10 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{review.user?.name || "Guest"}</p>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">
                      Stayed: {review.booking?.checkInDate ? new Date(review.booking.checkInDate).toLocaleDateString() : 'N/A'} 
                      {" - "} 
                      {review.booking?.checkOutDate ? new Date(review.booking.checkOutDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <StarRating rating={review.rating} />
                    <p className="text-[10px] text-slate-400 dark:text-slate-550 font-semibold mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 bg-white dark:bg-zinc-950 p-3 rounded-xl border border-slate-50 dark:border-zinc-900 leading-relaxed">
                    "{review.comment}"
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-6 flex justify-end border-t border-slate-50 dark:border-zinc-800 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

