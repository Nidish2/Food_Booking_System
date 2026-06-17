import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getApiErrorMessage } from "../api/apiClient";
import { BookingForm } from "../components/bookings/BookingForm";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { RoomCard } from "../components/rooms/RoomCard";
import { RoomFilters } from "../components/rooms/RoomFilters";
import { RoomGridSkeleton } from "../components/common/SkeletonLoader";
import { useAuth } from "../hooks/useAuth";
import { useBookings } from "../hooks/useBookings";
import { useRooms } from "../hooks/useRooms";
import type { BookingFormValues } from "../schemas/booking.schema";
import type { Room } from "../types/room.types";
import type { RoomFilters as RoomFiltersType } from "../types/room.types";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
} as const;

export function RoomsPage() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [filters, setFilters] = useState<RoomFiltersType>({});
  const navigate = useNavigate();
  const { user } = useAuth();
  const { roomsQuery, roomTypesQuery } = useRooms(filters);
  const { createBookingMutation } = useBookings();

  const handleBooking = async (values: BookingFormValues) => {
    if (!selectedRoom) return;
    try {
      await createBookingMutation.mutateAsync({
        ...values,
        roomId: selectedRoom.id,
      });
      toast.success("Booking created successfully.");
      setSelectedRoom(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-blue dark:text-blue-400">
            Room Dashboard
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-brand-navy dark:text-white tracking-tight">
            {user?.role === "ADMIN" ? "Room Inventory" : "Find Available Rooms"}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Use date, type, capacity, and price filters to find rooms that fit
            the stay.
          </p>
        </div>
      </div>

      <RoomFilters
        value={filters}
        onChange={setFilters}
        roomTypes={roomTypesQuery.data ?? []}
      />

      <AnimatePresence mode="popLayout">
        {roomsQuery.isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <RoomGridSkeleton />
          </motion.div>
        ) : roomsQuery.isError ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ErrorState message="Unable to load rooms." />
          </motion.div>
        ) : roomsQuery.data?.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EmptyState
              title="No rooms yet"
              message="Add a room to start accepting bookings."
            />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {roomsQuery.data?.map((room) => (
              <motion.div key={room.id} variants={itemVariants}>
                <RoomCard
                  room={room}
                  onBook={setSelectedRoom}
                  canEdit={user?.role === "ADMIN"}
                  onEdit={(roomToEdit) => navigate(`/rooms/${roomToEdit.id}/edit`)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedRoom ? (
          <BookingForm
            room={selectedRoom}
            onClose={() => setSelectedRoom(null)}
            onSubmit={handleBooking}
            isSubmitting={createBookingMutation.isPending}
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}

