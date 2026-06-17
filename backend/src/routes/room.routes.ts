import { Router } from "express";
import { roomController } from "../controllers/room.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createRoomSchema,
  roomParamsSchema,
  updateRoomSchema,
} from "../validators/room.validator.js";

export const roomRoutes = Router();

roomRoutes.use(requireAuth);
roomRoutes.get("/types", asyncHandler(roomController.listRoomTypes));
roomRoutes.get("/", asyncHandler(roomController.listRooms));
roomRoutes.get(
  "/:id",
  validate(roomParamsSchema),
  asyncHandler(roomController.getRoom),
);
roomRoutes.post(
  "/",
  requireAdmin,
  validate(createRoomSchema),
  asyncHandler(roomController.createRoom),
);
roomRoutes.patch(
  "/:id",
  requireAdmin,
  validate(updateRoomSchema),
  asyncHandler(roomController.updateRoom),
);
