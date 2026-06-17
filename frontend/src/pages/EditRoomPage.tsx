import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { getApiErrorMessage } from "../api/apiClient";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { RoomForm } from "../components/rooms/RoomForm";
import { useRooms } from "../hooks/useRooms";
import type { RoomFormValues } from "../schemas/room.schema";

export function EditRoomPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { roomsQuery, roomTypesQuery, updateRoomMutation } = useRooms();
  const room = roomsQuery.data?.find((item) => item.id === id);

  const handleSubmit = async (values: RoomFormValues) => {
    if (!id) return;
    try {
      await updateRoomMutation.mutateAsync({ id, payload: values });
      toast.success("Room updated successfully.");
      navigate("/");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  if (roomsQuery.isLoading) return <LoadingState message="Loading room..." />;
  if (!room) return <ErrorState message="Room not found." />;

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-brand-blue dark:text-blue-400">Room Management</p>
        <h1 className="mt-1 text-3xl font-extrabold text-brand-navy dark:text-white tracking-tight">
          Edit Room {room.roomNumber}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Update room type, capacity, price, and description.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-colors duration-300">
        <RoomForm
          onSubmit={handleSubmit}
          isSubmitting={updateRoomMutation.isPending}
          submitLabel="Update Room"
          existingRooms={roomsQuery.data ?? []}
          roomTypes={roomTypesQuery.data ?? []}
          isEditMode
          defaultValues={{
            roomNumber: room.roomNumber,
            type: room.type,
            capacity: room.capacity,
            pricePerNight: Number(room.pricePerNight),
            description: room.description ?? "",
          }}
        />
      </div>
    </section>
  );
}

