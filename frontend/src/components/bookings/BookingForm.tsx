import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
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

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm px-4 py-6"
    >
      <motion.form
        initial={{ scale: 0.96, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 15 }}
        transition={{ type: "spring", stiffness: 350, damping: 26 }}
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-xl rounded-2xl bg-white/80 dark:bg-zinc-900/75 backdrop-blur-md p-7 shadow-2xl border border-white/20 dark:border-white/10 relative transition-colors duration-300"
      >
        <div className="mb-6 flex items-start justify-between gap-3 border-b border-slate-50 dark:border-white/5 pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-blue dark:text-brand-blue">Room {room.roomNumber}</p>
            <h2 className="mt-1 text-2xl font-extrabold text-brand-navy dark:text-white tracking-tight">Book {room.type}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-600 dark:hover:text-slate-350 transition"
            aria-label="Close booking form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Guest Name" placeholder="Full Name" error={errors.guestName?.message} {...register("guestName")} />
          <Input label="Guest Email" placeholder="name@example.com" error={errors.guestEmail?.message} {...register("guestEmail")} />
          <Input label="Check-in Date" type="date" error={errors.checkInDate?.message} {...register("checkInDate")} />
          <Input
            label="Check-out Date"
            type="date"
            error={errors.checkOutDate?.message}
            {...register("checkOutDate")}
          />
        </div>
        
        {nights > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="my-6 rounded-xl bg-slate-50 dark:bg-zinc-800 p-4 border border-slate-100/50 dark:border-white/5 flex justify-between items-center text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors duration-300"
          >
            <span className="text-slate-500 dark:text-slate-400">Estimated Total:</span>
            <span className="text-lg font-extrabold text-brand-navy dark:text-white">
              {formatCurrency(total)} <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">({nights} {nights === 1 ? "night" : "nights"})</span>
            </span>
          </motion.div>
        ) : (
          <div className="my-6 h-[54px] rounded-xl bg-slate-50/50 dark:bg-zinc-800/40 border border-slate-100/30 dark:border-white/5 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 font-medium italic transition-colors duration-300">
            Select check-in and check-out dates to calculate total pricing.
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-50 dark:border-white/5 pt-5">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Confirm Booking
          </Button>
        </div>
      </motion.form>
    </motion.div>,
    document.body
  );
}

