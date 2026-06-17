import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "../validators/auth.validator.js";
import { env } from "../config/env.js";

export const authRoutes = Router();

import { rateLimit } from "express-rate-limit";

const authLimiter = process.env.NODE_ENV === "test" 
  ? (req: any, res: any, next: any) => next() 
  : rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      limit: env.AUTH_LIMIT_MAX, // Configurable rate limit (defaults to 100)
      standardHeaders: "draft-7",
      legacyHeaders: false,
    });

authRoutes.post("/register", validate(registerSchema), asyncHandler(authController.register));
authRoutes.post("/login", authLimiter, validate(loginSchema), asyncHandler(authController.login));
authRoutes.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), asyncHandler(authController.forgotPassword));
authRoutes.post("/reset-password", authLimiter, validate(resetPasswordSchema), asyncHandler(authController.resetPassword));
authRoutes.get("/me", requireAuth, asyncHandler(authController.me));
authRoutes.post("/logout", asyncHandler(authController.logout));
