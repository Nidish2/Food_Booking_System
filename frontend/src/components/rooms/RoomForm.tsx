import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { AutocompleteInput } from "../common/AutocompleteInput";
import { roomSchema, type RoomFormValues } from "../../schemas/room.schema";
import { fixedRoomNumbers } from "../../constants/roomNumbers";
import type { Room } from "../../types/room.types";

type RoomFormProps = {
  onSubmit: (values: RoomFormValues) => void;
  isSubmitting: boolean;
  defaultValues?: Partial<RoomFormValues>;
  submitLabel?: string;
  existingRooms?: Room[];
  roomTypes: string[];
  isEditMode?: boolean;
};

export function RoomForm({
  onSubmit,
  isSubmitting,
  defaultValues,
  submitLabel = "Add Room",
  existingRooms = [],
  roomTypes,
  isEditMode = false,
}: RoomFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: { capacity: 2, pricePerNight: 3000, ...defaultValues },
  });

  const occupiedRoomNumbers = new Set(
    existingRooms.map((room) => room.roomNumber),
  );

  const roomNumberOptions = Array.from(
    new Set([
      ...fixedRoomNumbers.filter(
        (roomNumber) =>
          !occupiedRoomNumbers.has(roomNumber) ||
          roomNumber === defaultValues?.roomNumber,
      ),
      defaultValues?.roomNumber ?? "",
    ]),
  )
    .filter(Boolean)
    .sort((left, right) =>
      left.localeCompare(right, undefined, { numeric: true }),
    );
  const roomTypeOptions = Array.from(
    new Set([...roomTypes, defaultValues?.type ?? ""]),
  )
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right));

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-sm border border-slate-100 dark:border-zinc-800 transition-colors duration-300"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Controller
          name="roomNumber"
          control={control}
          render={({ field }) => (
            <AutocompleteInput
              label="Room Number"
              placeholder="101 or custom number"
              disabled={isEditMode}
              error={errors.roomNumber?.message}
              value={field.value ?? ""}
              onChange={field.onChange}
              suggestions={roomNumberOptions}
              helperText="Suggested built numbers that are still free. You can type a custom number too."
            />
          )}
        />
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <AutocompleteInput
              label="Room Type"
              placeholder="Suite or custom type"
              error={errors.type?.message}
              value={field.value ?? ""}
              onChange={field.onChange}
              suggestions={roomTypeOptions}
              helperText="Suggested from existing room types. You can type a custom type too."
            />
          )}
        />
        <Input
          label="Capacity"
          type="number"
          error={errors.capacity?.message}
          {...register("capacity")}
        />
        <Input
          label="Price Per Night"
          type="number"
          error={errors.pricePerNight?.message}
          {...register("pricePerNight")}
        />
      </div>
      <label className="block text-left">
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Description
        </span>
        <textarea
          className="min-h-28 w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition-all placeholder-slate-400 dark:placeholder-slate-500 focus:border-brand-navy/60 dark:focus:border-brand-blue/60 focus:ring-4 focus:ring-brand-navy/10 dark:focus:ring-brand-blue/15"
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
