import { z } from "zod";

export const createBookingSchema = z.object({
  body: z.object({
    roomId: z.string().uuid("Invalid room ID."),
    guestName: z.string().trim().min(2, "Guest name is required."),
    guestEmail: z.string().trim().email("Enter a valid guest email address.").toLowerCase(),
    checkInDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format."),
    checkOutDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format.")
  })
});

export const reviewSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid booking ID.")
  }),
  body: z.object({
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().trim().max(500).optional().or(z.literal(""))
  })
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>["body"];
export type ReviewInput = z.infer<typeof reviewSchema>["body"];
