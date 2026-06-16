import type { Request, Response } from "express";
import { httpStatus } from "../constants/httpStatus.js";
import { userService } from "../services/user.service.js";

export const userController = {
  async listUsers(_req: Request, res: Response) {
    const users = await userService.listUsers();
    res.status(httpStatus.OK).json({
      success: true,
      message: "Users fetched successfully.",
      data: { users }
    });
  }
};
