import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const bookingSchema = z
  .object({
    guestName: z.string().trim().min(2, "Guest name is required."),
    guestEmail: z.string().trim().email("Enter a valid guest email address."),
    checkInDate: z.string().min(1, "Check-in date is required."),
    checkOutDate: z.string().min(1, "Check-out date is required.")
  })
  .refine((data) => new Date(data.checkInDate) >= today, {
    message: "Check-in date cannot be in the past.",
    path: ["checkInDate"]
  })
  .refine((data) => new Date(data.checkOutDate) > new Date(data.checkInDate), {
    message: "Check-out date must be after check-in date.",
    path: ["checkOutDate"]
  });

export type BookingFormValues = z.infer<typeof bookingSchema>;
