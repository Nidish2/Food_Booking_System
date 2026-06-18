import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { getApiErrorMessage } from "../../api/apiClient";
import { useAuth } from "../../hooks/useAuth";
import { useBookings } from "../../hooks/useBookings";
import { BookingDetailModal } from "./BookingDetailModal";
import { ReviewForm } from "./ReviewForm";
import { Badge } from "../common/Badge";
import type { Booking } from "../../types/booking.types";
import { formatCurrency } from "../../utils/currency";
import { calculateNights, formatDate } from "../../utils/date";
import { Button } from "../common/Button";
import { StarRating } from "../common/StarRating";
import { ConfirmModal } from "../common/ConfirmModal";

const getBookingStatus = (booking: Booking) => {
  if (booking.status === "CANCELLED") return { label: "CANCELLED", tone: "warning" as const };
  const today = new Date();
  const checkIn = new Date(booking.checkInDate);
  const checkOut = new Date(booking.checkOutDate);
  if (today < checkIn) return { label: "UPCOMING", tone: "success" as const };
  if (today >= checkIn && today < checkOut) return { label: "ACTIVE", tone: "success" as const };
  return { label: "COMPLETED", tone: "neutral" as const };
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 26 } }
} as const;

export function BookingHistoryTable({ bookings }: { bookings: Booking[] }) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const { user } = useAuth();
  const { addReviewMutation, cancelBookingMutation } = useBookings();

  const canReview = (booking: Booking) =>
    user?.role !== "ADMIN" &&
    !booking.review &&
    booking.status === "CONFIRMED" &&
    new Date(booking.checkOutDate) <= new Date();

  const submitReview = async (booking: Booking, values: { rating: number; comment?: string }) => {
    try {
      await addReviewMutation.mutateAsync({ bookingId: booking.id, payload: values });
      toast.success("Feedback submitted successfully.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleCancelClick = (bookingId: string) => {
    setBookingToCancel(bookingId);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    try {
      await cancelBookingMutation.mutateAsync(bookingToCancel);
      toast.success("Booking cancelled successfully.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setBookingToCancel(null);
    }
  };

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        {bookings.map((booking) => {
          const status = getBookingStatus(booking);
          const nights = calculateNights(booking.checkInDate, booking.checkOutDate);
          return (
            <motion.article
              key={booking.id}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col justify-between rounded-3xl border border-slate-100 dark:border-white/5 bg-white dark:bg-zinc-900 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-[0_15px_30px_rgba(9,47,107,0.04)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] duration-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-navy/60 dark:text-blue-400">Room {booking.room.roomNumber}</p>
                    <h2 className="mt-1 text-xl font-extrabold text-brand-navy dark:text-white tracking-tight">{booking.room.type}</h2>
                  </div>
                  <Badge tone={status.tone}>{status.label}</Badge>
                </div>
                
                <div className="mt-5 space-y-2 text-sm text-slate-600 dark:text-slate-400 border-t border-slate-50 dark:border-white/5 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-400 dark:text-slate-500">Guest:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{booking.guestName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-400 dark:text-slate-500">Email:</span>
                    <span className="text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{booking.guestEmail}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-400 dark:text-slate-500">Dates:</span>
                    <span className="text-slate-700 dark:text-slate-300">{formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-400 dark:text-slate-500">Nights:</span>
                    <span className="text-slate-700 dark:text-slate-300">{nights} {nights === 1 ? 'night' : 'nights'}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50/70 dark:bg-zinc-800/50 p-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Paid</span>
                  <span className="text-base font-extrabold text-brand-navy dark:text-white">{formatCurrency(booking.totalAmount)}</span>
                </div>

                {booking.review ? (
                  <div className="mt-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-zinc-800/30 p-3">
                    <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-brand-navy/60 dark:text-slate-400">Your Feedback</p>
                    <StarRating rating={booking.review.rating} />
                    {booking.review.comment ? (
                      <p className="mt-2 text-xs italic text-slate-500 dark:text-slate-300 bg-white dark:bg-zinc-800/80 p-2 rounded-lg border border-slate-50 dark:border-white/5">
                        "{booking.review.comment}"
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {canReview(booking) ? (
                  <div className="mt-4 border-t border-slate-50 dark:border-white/5 pt-4">
                    <ReviewForm
                      onSubmit={(values) => submitReview(booking, values)}
                      isSubmitting={addReviewMutation.isPending}
                    />
                  </div>
                ) : null}
              </div>
              
              <div className="mt-5 flex gap-3">
                <Button className="w-full" variant="secondary" onClick={() => setSelectedBooking(booking)}>
                  View Details
                </Button>
                {status.label === "UPCOMING" ? (
                  <Button
                    className="w-full"
                    variant="danger"
                    onClick={() => handleCancelClick(booking.id)}
                  >
                    Cancel
                  </Button>
                ) : null}
              </div>
            </motion.article>
          );
        })}
      </motion.div>
      <AnimatePresence>
        {selectedBooking ? (
          <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
        ) : null}
      </AnimatePresence>
      <ConfirmModal
        isOpen={Boolean(bookingToCancel)}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This will release your room reservation slot."
        confirmLabel="Yes, Cancel"
        cancelLabel="No, Keep"
        onConfirm={handleConfirmCancel}
        onCancel={() => setBookingToCancel(null)}
        isConfirming={cancelBookingMutation.isPending}
      />
    </>
  );
}

