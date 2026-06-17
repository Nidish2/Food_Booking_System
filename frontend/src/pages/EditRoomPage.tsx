import toast from "react-hot-toast";
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
    <section className="mx-auto max-w-3xl">
      <div className="mb-6">
        <p className="text-sm font-semibold text-brand-blue">Room Management</p>
        <h1 className="text-3xl font-bold text-brand-navy">
          Edit Room {room.roomNumber}
        </h1>
        <p className="mt-1 text-slate-600">
          Update room type, capacity, price, and description.
        </p>
      </div>
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
    </section>
  );
}
