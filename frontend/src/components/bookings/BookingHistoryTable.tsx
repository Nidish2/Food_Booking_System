import { useState } from "react";
import toast from "react-hot-toast";
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

const getBookingStatus = (booking: Booking) => {
  if (booking.status === "CANCELLED") return { label: "CANCELLED", tone: "warning" as const };
  const today = new Date();
  const checkIn = new Date(booking.checkInDate);
  const checkOut = new Date(booking.checkOutDate);
  if (today < checkIn) return { label: "UPCOMING", tone: "success" as const };
  if (today >= checkIn && today < checkOut) return { label: "ACTIVE", tone: "success" as const };
  return { label: "COMPLETED", tone: "neutral" as const };
};

export function BookingHistoryTable({ bookings }: { bookings: Booking[] }) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { user } = useAuth();
  const { addReviewMutation } = useBookings();

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

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {bookings.map((booking) => {
        const status = getBookingStatus(booking);
        const nights = calculateNights(booking.checkInDate, booking.checkOutDate);
        return (
          <article key={booking.id} className="rounded-lg border border-brand-border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-brand-blue">Room {booking.room.roomNumber}</p>
                <h2 className="text-xl font-bold text-brand-navy">{booking.room.type}</h2>
              </div>
              <Badge tone={status.tone}>{status.label}</Badge>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <p>
                <strong>Guest:</strong> {booking.guestName}
              </p>
              <p>
                <strong>Email:</strong> {booking.guestEmail}
              </p>
              <p>
                <strong>Dates:</strong> {formatDate(booking.checkInDate)} to {formatDate(booking.checkOutDate)}
              </p>
              <p>
                <strong>Nights:</strong> {nights}
              </p>
              <p>
                <strong>Capacity:</strong> {booking.room.capacity}
              </p>
            </div>
            <div className="mt-4 rounded-md bg-brand-light p-3">
              <p className="text-sm text-slate-500">Total paid</p>
              <p className="text-lg font-bold text-brand-navy">{formatCurrency(booking.totalAmount)}</p>
            </div>
            {booking.review ? (
              <div className="mt-4 rounded-md border border-brand-border p-3">
                <p className="mb-1 text-sm font-semibold text-brand-navy">Your feedback</p>
                <StarRating rating={booking.review.rating} />
                {booking.review.comment ? <p className="mt-2 text-sm text-slate-600">{booking.review.comment}</p> : null}
              </div>
            ) : null}
            {canReview(booking) ? (
              <ReviewForm
                onSubmit={(values) => submitReview(booking, values)}
                isSubmitting={addReviewMutation.isPending}
              />
            ) : null}
            <Button className="mt-4 w-full" variant="secondary" onClick={() => setSelectedBooking(booking)}>
              View Details
            </Button>
          </article>
        );
      })}
      </div>
      {selectedBooking ? <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} /> : null}
    </>
  );
}
