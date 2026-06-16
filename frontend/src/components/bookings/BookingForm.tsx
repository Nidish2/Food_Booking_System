import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { bookingSchema, type BookingFormValues } from "../../schemas/booking.schema";
import type { Room } from "../../types/room.types";
import { calculateNights } from "../../utils/date";
import { formatCurrency } from "../../utils/currency";

type BookingFormProps = {
  room: Room;
  onClose: () => void;
  onSubmit: (values: BookingFormValues) => void;
  isSubmitting: boolean;
};

export function BookingForm({ room, onClose, onSubmit, isSubmitting }: BookingFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema)
  });

  const nights = calculateNights(watch("checkInDate"), watch("checkOutDate"));
  const total = nights * Number(room.pricePerNight);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4 py-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-brand-blue">Room {room.roomNumber}</p>
            <h2 className="text-2xl font-bold text-brand-navy">Book {room.type}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close booking form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Guest Name" error={errors.guestName?.message} {...register("guestName")} />
          <Input label="Guest Email" error={errors.guestEmail?.message} {...register("guestEmail")} />
          <Input label="Check-in Date" type="date" error={errors.checkInDate?.message} {...register("checkInDate")} />
          <Input
            label="Check-out Date"
            type="date"
            error={errors.checkOutDate?.message}
            {...register("checkOutDate")}
          />
        </div>
        <div className="my-5 rounded-md bg-brand-light p-4 text-sm text-slate-700">
          <strong className="text-brand-navy">Estimated total:</strong> {formatCurrency(total)} for {nights} night
          {nights === 1 ? "" : "s"}
        </div>
        <div className="flex flex-wrap justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Booking..." : "Confirm Booking"}
          </Button>
        </div>
      </form>
    </div>
  );
}
