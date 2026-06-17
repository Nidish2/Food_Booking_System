import type { Request, Response } from "express";
import { httpStatus } from "../constants/httpStatus.js";
import { roomService } from "../services/room.service.js";
import type {
  CreateRoomInput,
  UpdateRoomInput,
} from "../validators/room.validator.js";

export const roomController = {
  async listRoomTypes(_req: Request, res: Response) {
    const roomTypes = await roomService.listRoomTypes();
    res.status(httpStatus.OK).json({
      success: true,
      message: "Room types fetched successfully.",
      data: { roomTypes },
    });
  },

  async listRooms(req: Request, res: Response) {
    const rooms = await roomService.listRooms(
      req.query as Record<string, string>,
    );
    res.status(httpStatus.OK).json({
      success: true,
      message: "Rooms fetched successfully.",
      data: { rooms },
    });
  },

  async getRoom(req: Request, res: Response) {
    const room = await roomService.getRoom(req.params.id);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Room fetched successfully.",
      data: { room },
    });
  },

  async createRoom(req: Request, res: Response) {
    const room = await roomService.createRoom(
      req.body as CreateRoomInput,
      req.user!.id,
    );
    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Room created successfully.",
      data: { room },
    });
  },

  async updateRoom(req: Request, res: Response) {
    const room = await roomService.updateRoom(
      req.params.id,
      req.body as UpdateRoomInput,
    );
    res.status(httpStatus.OK).json({
      success: true,
      message: "Room updated successfully.",
      data: { room },
    });
  },
};
