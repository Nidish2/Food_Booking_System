export type Room = {
  id: string;
  roomNumber: string;
  type: string;
  capacity: number;
  pricePerNight: string;
  description?: string | null;
  createdAt: string;
  bookings?: {
    id: string;
    checkInDate: string;
    checkOutDate: string;
    status: "CONFIRMED" | "CANCELLED";
  }[];
  reviews?: {
    id: string;
    rating: number;
    comment?: string | null;
    createdAt: string;
  }[];
};

export type RoomFilters = {
  checkInDate?: string;
  checkOutDate?: string;
  type?: string;
  capacity?: string;
  minPrice?: string;
  maxPrice?: string;
};
