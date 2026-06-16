import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { roomSchema, type RoomFormValues } from "../../schemas/room.schema";
import { fixedRoomNumbers } from "../../constants/roomNumbers";
import type { Room } from "../../types/room.types";

type RoomFormProps = {
  onSubmit: (values: RoomFormValues) => void;
  isSubmitting: boolean;
  defaultValues?: Partial<RoomFormValues>;
  submitLabel?: string;
  existingRooms?: Room[];
  isEditMode?: boolean;
};

export function RoomForm({
  onSubmit,
  isSubmitting,
  defaultValues,
  submitLabel = "Add Room",
  existingRooms = [],
  isEditMode = false
}: RoomFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: { capacity: 2, pricePerNight: 3000, ...defaultValues }
  });

  const usedRoomNumbers = new Set(existingRooms.map((room) => room.roomNumber));
  const roomNumberOptions = fixedRoomNumbers.filter(
    (roomNumber) => !usedRoomNumbers.has(roomNumber) || roomNumber === defaultValues?.roomNumber
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-slate-700">Room Number</span>
          <select
            className="min-h-11 w-full rounded-md border border-brand-border bg-white px-3 py-2 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15"
            disabled={isEditMode}
            {...register("roomNumber")}
          >
            <option value="">Select room number</option>
            {roomNumberOptions.map((roomNumber) => (
              <option key={roomNumber} value={roomNumber}>
                {roomNumber}
              </option>
            ))}
          </select>
          {errors.roomNumber?.message ? (
            <span className="mt-1 block text-sm text-brand-danger">{errors.roomNumber.message}</span>
          ) : null}
        </label>
        <Input label="Room Type" placeholder="Deluxe King" error={errors.type?.message} {...register("type")} />
        <Input label="Capacity" type="number" error={errors.capacity?.message} {...register("capacity")} />
        <Input
          label="Price Per Night"
          type="number"
          error={errors.pricePerNight?.message}
          {...register("pricePerNight")}
        />
      </div>
      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-slate-700">Description</span>
        <textarea
          className="min-h-28 w-full rounded-md border border-brand-border px-3 py-2 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15"
          placeholder="Short room description"
          {...register("description")}
        />
      </label>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
