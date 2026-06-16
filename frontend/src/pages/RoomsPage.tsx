import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../api/apiClient";
import { BookingForm } from "../components/bookings/BookingForm";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { RoomCard } from "../components/rooms/RoomCard";
import { RoomFilters } from "../components/rooms/RoomFilters";
import { useAuth } from "../hooks/useAuth";
import { useBookings } from "../hooks/useBookings";
import { useRooms } from "../hooks/useRooms";
import type { BookingFormValues } from "../schemas/booking.schema";
import type { Room } from "../types/room.types";
import type { RoomFilters as RoomFiltersType } from "../types/room.types";

export function RoomsPage() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [filters, setFilters] = useState<RoomFiltersType>({});
  const navigate = useNavigate();
  const { user } = useAuth();
  const { roomsQuery } = useRooms(filters);
  const { createBookingMutation } = useBookings();

  const handleBooking = async (values: BookingFormValues) => {
    if (!selectedRoom) return;
    try {
      await createBookingMutation.mutateAsync({ ...values, roomId: selectedRoom.id });
      toast.success("Booking created successfully.");
      setSelectedRoom(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-blue">Room Dashboard</p>
          <h1 className="text-3xl font-bold text-brand-navy">
            {user?.role === "ADMIN" ? "Room Inventory" : "Find Available Rooms"}
          </h1>
          <p className="mt-1 text-slate-600">
            Use date, type, capacity, and price filters to find rooms that fit the stay.
          </p>
        </div>
      </div>

      <RoomFilters value={filters} onChange={setFilters} />

      {roomsQuery.isLoading ? <LoadingState message="Loading rooms..." /> : null}
      {roomsQuery.isError ? <ErrorState message="Unable to load rooms." /> : null}
      {roomsQuery.data?.length === 0 ? (
        <EmptyState title="No rooms yet" message="Add a room to start accepting bookings." />
      ) : null}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {roomsQuery.data?.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onBook={setSelectedRoom}
            canEdit={user?.role === "ADMIN"}
            onEdit={(roomToEdit) => navigate(`/rooms/${roomToEdit.id}/edit`)}
          />
        ))}
      </div>

      {selectedRoom ? (
        <BookingForm
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onSubmit={handleBooking}
          isSubmitting={createBookingMutation.isPending}
        />
      ) : null}
    </section>
  );
}
