import { X } from "lucide-react";
import type { Booking } from "../../types/booking.types";
import { formatCurrency } from "../../utils/currency";
import { calculateNights, formatDate } from "../../utils/date";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";

export function BookingDetailModal({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4 py-6">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-brand-blue">Booking Detail</p>
            <h2 className="text-2xl font-bold text-brand-navy">Room {booking.room.roomNumber}</h2>
          </div>
          <button className="rounded-md p-2 text-slate-500 hover:bg-slate-100" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Info label="Guest" value={booking.guestName} />
          <Info label="Guest Email" value={booking.guestEmail} />
          <Info label="Room Type" value={booking.room.type} />
          <Info label="Capacity" value={`${booking.room.capacity} guests`} />
          <Info label="Check-in" value={formatDate(booking.checkInDate)} />
          <Info label="Check-out" value={formatDate(booking.checkOutDate)} />
          <Info label="Total Nights" value={`${calculateNights(booking.checkInDate, booking.checkOutDate)}`} />
          <Info label="Total Paid" value={formatCurrency(booking.totalAmount)} />
        </div>
        <div className="mt-5 flex items-center justify-between rounded-md bg-brand-light p-4">
          <Badge tone={booking.status === "CONFIRMED" ? "success" : "warning"}>{booking.status}</Badge>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-brand-border p-3">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-brand-navy">{value}</p>
    </div>
  );
}
