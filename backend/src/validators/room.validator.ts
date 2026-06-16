import { z } from "zod";

export const createRoomSchema = z.object({
  body: z.object({
    roomNumber: z.string().trim().min(1, "Room number is required."),
    type: z.string().trim().min(2, "Room type is required."),
    capacity: z.coerce.number().int().positive("Capacity must be greater than 0."),
    pricePerNight: z.coerce.number().positive("Price per night must be greater than 0."),
    description: z.string().trim().max(500).optional().or(z.literal(""))
  })
});

export const updateRoomSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid room ID.")
  }),
  body: z.object({
    roomNumber: z.string().trim().min(1, "Room number is required.").optional(),
    type: z.string().trim().min(2, "Room type is required.").optional(),
    capacity: z.coerce.number().int().positive("Capacity must be greater than 0.").optional(),
    pricePerNight: z.coerce.number().positive("Price per night must be greater than 0.").optional(),
    description: z.string().trim().max(500).optional().or(z.literal(""))
  })
});

export const roomParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid room ID.")
  })
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>["body"];
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>["body"];
