import { z } from "zod";

export const roomSchema = z.object({
  roomNumber: z.string().trim().min(1, "Room number is required."),
  type: z.string().trim().min(2, "Room type is required."),
  capacity: z.coerce.number().int().positive("Capacity must be greater than 0."),
  pricePerNight: z.coerce.number().positive("Price must be greater than 0."),
  description: z.string().optional()
});

export type RoomFormValues = z.infer<typeof roomSchema>;
