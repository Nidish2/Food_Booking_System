import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../api/apiClient";
import { RoomForm } from "../components/rooms/RoomForm";
import { useRooms } from "../hooks/useRooms";
import type { RoomFormValues } from "../schemas/room.schema";

export function AddRoomPage() {
  const navigate = useNavigate();
  const { createRoomMutation, roomsQuery, roomTypesQuery } = useRooms();

  const handleSubmit = async (values: RoomFormValues) => {
    try {
      await createRoomMutation.mutateAsync(values);
      toast.success("Room created successfully.");
      navigate("/");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-brand-blue dark:text-blue-400">Room Management</p>
        <h1 className="mt-1 text-3xl font-extrabold text-brand-navy dark:text-white tracking-tight">Add Room</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Create a room with clear capacity and pricing details.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-colors duration-300">
        <RoomForm
          onSubmit={handleSubmit}
          isSubmitting={createRoomMutation.isPending}
          existingRooms={roomsQuery.data ?? []}
          roomTypes={roomTypesQuery.data ?? []}
        />
      </div>
    </section>
  );
}

