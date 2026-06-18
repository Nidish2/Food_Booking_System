import { apiClient } from "./apiClient";
import type { Booking, BookingDisplayStatus, Review } from "../types/booking.types";

export const bookingsApi = {
  async create(payload: {
    roomId: string;
    guestName: string;
    guestEmail: string;
    checkInDate: string;
    checkOutDate: string;
  }) {
    const { data } = await apiClient.post<{ data: { booking: Booking } }>("/bookings", payload);
    return data.data.booking;
  },

  async history(status?: BookingDisplayStatus) {
    const { data } = await apiClient.get<{ data: { bookings: Booking[] } }>("/bookings/history", {
      params: status && status !== "ALL" ? { status } : undefined
    });
    return data.data.bookings;
  },

  async my() {
    const { data } = await apiClient.get<{ data: { bookings: Booking[] } }>("/bookings/my");
    return data.data.bookings;
  },

  async addReview(bookingId: string, payload: { rating: number; comment?: string }) {
    const { data } = await apiClient.post<{ data: { review: Review } }>(`/bookings/${bookingId}/review`, payload);
    return data.data.review;
  },

  async cancel(bookingId: string) {
    const { data } = await apiClient.post<{ data: { booking: Booking } }>(`/bookings/${bookingId}/cancel`);
    return data.data.booking;
  }
};
