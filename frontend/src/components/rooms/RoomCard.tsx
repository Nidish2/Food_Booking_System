import { BedDouble, Edit, IndianRupee, Users } from "lucide-react";
import type { Room } from "../../types/room.types";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { formatCurrency } from "../../utils/currency";
import { StarRating } from "../common/StarRating";

type RoomCardProps = {
  room: Room;
  onBook: (room: Room) => void;
  onEdit?: (room: Room) => void;
  canEdit?: boolean;
};

export function RoomCard({ room, onBook, onEdit, canEdit = false }: RoomCardProps) {
  const averageRating =
    room.reviews && room.reviews.length > 0
      ? room.reviews.reduce((sum, review) => sum + review.rating, 0) / room.reviews.length
      : 0;

  return (
    <article className="rounded-lg border border-brand-border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-brand-blue">Room {room.roomNumber}</p>
          <h3 className="mt-1 text-xl font-bold text-brand-navy">{room.type}</h3>
        </div>
        <Badge tone="success">Bookable</Badge>
      </div>
      <p className="mt-3 min-h-12 text-sm text-slate-600">
        {room.description || "Comfortable room ready for guest bookings."}
      </p>
      <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
        {averageRating > 0 ? (
          <>
            <StarRating rating={Math.round(averageRating)} />
            <span>{averageRating.toFixed(1)} ({room.reviews?.length} feedback)</span>
          </>
        ) : (
          <span>No feedback yet</span>
        )}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-700">
        <span className="flex items-center gap-2">
          <Users className="h-4 w-4 text-brand-blue" /> {room.capacity} guests
        </span>
        <span className="flex items-center gap-2">
          <BedDouble className="h-4 w-4 text-brand-blue" /> {room.type}
        </span>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="flex items-center text-lg font-bold text-brand-navy">
          <IndianRupee className="h-5 w-5" />
          {formatCurrency(room.pricePerNight).replace("₹", "")}
          <span className="ml-1 text-sm font-medium text-slate-500">/ night</span>
        </span>
        <div className="flex gap-2">
          {canEdit ? (
            <Button variant="secondary" onClick={() => onEdit?.(room)} aria-label={`Edit room ${room.roomNumber}`}>
              <Edit className="h-4 w-4" />
            </Button>
          ) : null}
          <Button onClick={() => onBook(room)}>Book Room</Button>
        </div>
      </div>
    </article>
  );
}
