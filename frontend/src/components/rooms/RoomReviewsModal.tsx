import { X } from "lucide-react";
import type { Room } from "../../types/room.types";
import { Button } from "../common/Button";
import { StarRating } from "../common/StarRating";

type RoomReviewsModalProps = {
  room: Room;
  onClose: () => void;
};

export function RoomReviewsModal({ room, onClose }: RoomReviewsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-brand-navy">Reviews for Room {room.roomNumber}</h2>
            <p className="text-sm text-slate-600">{room.type} - {room.capacity} guests</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {!room.reviews || room.reviews.length === 0 ? (
            <p className="text-center text-slate-500 py-8">No feedback yet for this room.</p>
          ) : (
            room.reviews.map((review) => (
              <div key={review.id} className="rounded-lg border border-brand-border p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-brand-navy">{review.user?.name || "Guest"}</p>
                    <p className="text-xs text-slate-500">
                      Stayed: {review.booking?.checkInDate ? new Date(review.booking.checkInDate).toLocaleDateString() : 'N/A'} 
                      {" - "} 
                      {review.booking?.checkOutDate ? new Date(review.booking.checkOutDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <StarRating rating={review.rating} />
                    <p className="text-xs text-slate-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-slate-700 mt-2 bg-slate-50 p-3 rounded-md">
                    "{review.comment}"
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-6 flex justify-end border-t border-brand-border pt-4">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
