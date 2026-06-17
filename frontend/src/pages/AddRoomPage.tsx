import toast from "react-hot-toast";
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
    <section className="mx-auto max-w-3xl">
      <div className="mb-6">
        <p className="text-sm font-semibold text-brand-blue">Room Management</p>
        <h1 className="text-3xl font-bold text-brand-navy">Add Room</h1>
        <p className="mt-1 text-slate-600">
          Create a room with clear capacity and pricing details.
        </p>
      </div>
      <RoomForm
        onSubmit={handleSubmit}
        isSubmitting={createRoomMutation.isPending}
        existingRooms={roomsQuery.data ?? []}
        roomTypes={roomTypesQuery.data ?? []}
      />
    </section>
  );
}
