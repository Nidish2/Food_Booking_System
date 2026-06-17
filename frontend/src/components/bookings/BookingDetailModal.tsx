import { X } from "lucide-react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import type { Booking } from "../../types/booking.types";
import { formatCurrency } from "../../utils/currency";
import { calculateNights, formatDate } from "../../utils/date";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";

export function BookingDetailModal({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm px-4 py-6"
    >
      <motion.div
        initial={{ scale: 0.96, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 15 }}
        transition={{ type: "spring", stiffness: 350, damping: 26 }}
        className="w-full max-w-2xl rounded-2xl bg-white/80 dark:bg-zinc-900/75 backdrop-blur-md p-7 shadow-2xl border border-white/20 dark:border-white/10"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-50 dark:border-zinc-800 pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-blue dark:text-brand-blue">Booking Detail</p>
            <h2 className="mt-1 text-2xl font-extrabold text-brand-navy dark:text-white tracking-tight">Room {booking.room.roomNumber}</h2>
          </div>
          <button className="rounded-xl p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-600 dark:hover:text-slate-200 transition" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Info label="Guest Name" value={booking.guestName} />
          <Info label="Guest Email" value={booking.guestEmail} />
          <Info label="Room Type" value={booking.room.type} />
          <Info label="Capacity" value={`${booking.room.capacity} guests`} />
          <Info label="Check-in" value={formatDate(booking.checkInDate)} />
          <Info label="Check-out" value={formatDate(booking.checkOutDate)} />
          <Info label="Total Nights" value={`${calculateNights(booking.checkInDate, booking.checkOutDate)}`} />
          <Info label="Total Paid" value={formatCurrency(booking.totalAmount)} />
        </div>
        <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-50 dark:bg-zinc-800/50 p-4 border border-slate-100/50 dark:border-zinc-800">
          <Badge tone={booking.status === "CONFIRMED" ? "success" : "warning"}>{booking.status}</Badge>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/20 dark:bg-zinc-800/10 p-3.5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</p>
      <p className="mt-1.5 font-bold text-slate-800 dark:text-slate-200 text-sm">{value}</p>
    </div>
  );
}

