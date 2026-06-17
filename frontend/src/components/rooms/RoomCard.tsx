import { useState } from "react";
import { BedDouble, Edit, IndianRupee, Users } from "lucide-react";
import { motion } from "framer-motion";
import type { Room } from "../../types/room.types";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { formatCurrency } from "../../utils/currency";
import { StarRating } from "../common/StarRating";
import { RoomReviewsModal } from "./RoomReviewsModal";

type RoomCardProps = {
  room: Room;
  onBook: (room: Room) => void;
  onEdit?: (room: Room) => void;
  canEdit?: boolean;
};

const getRoomImage = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("presidential")) return "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80";
  if (t.includes("honeymoon")) return "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80";
  if (t.includes("family")) return "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80";
  if (t.includes("executive") || t.includes("twin")) return "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80";
  if (t.includes("deluxe") || t.includes("king")) return "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80";
  if (t.includes("queen") || t.includes("standard")) return "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80";
  return "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80";
};

export function RoomCard({ room, onBook, onEdit, canEdit = false }: RoomCardProps) {
  const [showReviews, setShowReviews] = useState(false);

  const averageRating =
    room.reviews && room.reviews.length > 0
      ? room.reviews.reduce((sum, review) => sum + review.rating, 0) / room.reviews.length
      : 0;

  return (
    <>
      <motion.article
        whileHover={{ y: -5, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="flex flex-col justify-between rounded-3xl border border-slate-100/90 dark:border-white/5 bg-white dark:bg-zinc-900 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(9,47,107,0.06)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] transition-all duration-300"
      >
        {/* Top visual block */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-zinc-800">
          <img
            src={getRoomImage(room.type)}
            alt={room.type}
            loading="lazy"
            className="h-full w-full object-cover hover:scale-105 transition duration-500"
          />
          <div className="absolute top-4 left-4">
            <span className="rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1 text-xs font-bold text-white border border-white/10 shadow-sm">
              Room {room.roomNumber}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <span className="rounded-full bg-emerald-600 dark:bg-emerald-500 px-3 py-1 text-xs font-extrabold text-white shadow-md">
              Bookable
            </span>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{room.type}</h3>
            
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2 min-h-10">
              {room.description || "Comfortable room ready for guest bookings."}
            </p>
            
            <button 
              onClick={() => room.reviews && room.reviews.length > 0 && setShowReviews(true)}
              className={`mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 ${room.reviews && room.reviews.length > 0 ? 'hover:text-brand-blue cursor-pointer transition-colors font-medium' : 'cursor-default'}`}
              aria-label={room.reviews && room.reviews.length > 0 ? "View reviews" : "No reviews available"}
            >
              {averageRating > 0 ? (
                <>
                  <StarRating rating={Math.round(averageRating)} />
                  <span className="underline decoration-dotted underline-offset-2 text-xs font-bold">{averageRating.toFixed(1)} ({room.reviews?.length} feedback)</span>
                </>
              ) : (
                <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">No feedback yet</span>
              )}
            </button>

            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-50 dark:border-white/5 pt-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-2">
                <Users className="h-4.5 w-4.5 text-brand-blue" />
                <span>{room.capacity} guests</span>
              </span>
              <span className="flex items-center gap-2">
                <BedDouble className="h-4.5 w-4.5 text-brand-blue" />
                <span className="truncate">{room.type}</span>
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-50 dark:border-white/5 pt-4">
            <span className="flex items-baseline text-2xl font-extrabold text-slate-900 dark:text-white">
              <IndianRupee className="h-4 w-4 self-center text-slate-500 dark:text-slate-400" />
              <span>{formatCurrency(room.pricePerNight).replace("₹", "")}</span>
              <span className="ml-1 text-xs font-bold text-slate-400 dark:text-slate-500">/ night</span>
            </span>
            <div className="flex gap-2">
              {canEdit ? (
                <Button variant="secondary" className="px-3" onClick={() => onEdit?.(room)} aria-label={`Edit room ${room.roomNumber}`}>
                  <Edit className="h-4 w-4" />
                </Button>
              ) : null}
              <Button onClick={() => onBook(room)}>Book Room</Button>
            </div>
          </div>
        </div>
      </motion.article>



      {showReviews && (
        <RoomReviewsModal room={room} onClose={() => setShowReviews(false)} />
      )}
    </>
  );
}
