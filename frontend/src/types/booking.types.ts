import type { Room } from "./room.types";
import type { User } from "./auth.types";

export type Review = {
  id: string;
  bookingId: string;
  roomId: string;
  userId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
};

export type Booking = {
  id: string;
  roomId: string;
  userId: string;
  guestName: string;
  guestEmail: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: string;
  status: "CONFIRMED" | "CANCELLED";
  createdAt: string;
  room: Room;
  review?: Review | null;
  user?: Pick<User, "id" | "name" | "email">;
};

export type BookingDisplayStatus = "ALL" | "UPCOMING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
