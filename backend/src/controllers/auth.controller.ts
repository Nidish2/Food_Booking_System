import type { Request, Response } from "express";
import { env } from "../config/env.js";
import { httpStatus } from "../constants/httpStatus.js";
import { authService } from "../services/auth.service.js";
import type { LoginInput, RegisterInput } from "../validators/auth.validator.js";

const setAuthCookie = (res: Response, token: string) => {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000
  });
};

export const authController = {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body as RegisterInput);
    setAuthCookie(res, result.token);
    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Registration successful.",
      data: result
    });
  },

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body as LoginInput);
    setAuthCookie(res, result.token);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Login successful.",
      data: result
    });
  },

  async me(req: Request, res: Response) {
    res.status(httpStatus.OK).json({
      success: true,
      message: "Authenticated user fetched successfully.",
      data: { user: req.user }
    });
  },

  async logout(_req: Request, res: Response) {
    res.clearCookie("token");
    res.status(httpStatus.OK).json({
      success: true,
      message: "Logout successful."
    });
  },

  async forgotPassword(req: Request, res: Response) {
    const result = await authService.forgotPassword(req.body);
    res.status(httpStatus.OK).json({
      success: true,
      message: "If this email exists, a password reset link would be sent.",
      data: result
    });
  },

  async resetPassword(req: Request, res: Response) {
    await authService.resetPassword(req.body);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Password reset successful. Please sign in with your new password."
    });
  }
};
