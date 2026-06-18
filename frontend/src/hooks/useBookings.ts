import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingsApi } from "../api/bookings.api";
import type { BookingDisplayStatus } from "../types/booking.types";

export function useBookings(status?: BookingDisplayStatus) {
  const queryClient = useQueryClient();
  const historyQuery = useQuery({
    queryKey: ["booking-history", status],
    queryFn: () => bookingsApi.history(status)
  });

  const createBookingMutation = useMutation({
    mutationFn: bookingsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking-history"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    }
  });

  const addReviewMutation = useMutation({
    mutationFn: ({ bookingId, payload }: { bookingId: string; payload: { rating: number; comment?: string } }) =>
      bookingsApi.addReview(bookingId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking-history"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    }
  });

  const cancelBookingMutation = useMutation({
    mutationFn: (bookingId: string) => bookingsApi.cancel(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking-history"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    }
  });

  return { historyQuery, createBookingMutation, addReviewMutation, cancelBookingMutation };
}
