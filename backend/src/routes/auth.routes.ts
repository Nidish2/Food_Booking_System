import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { forgotPasswordSchema, loginSchema, registerSchema } from "../validators/auth.validator.js";

export const authRoutes = Router();

authRoutes.post("/register", validate(registerSchema), asyncHandler(authController.register));
authRoutes.post("/login", validate(loginSchema), asyncHandler(authController.login));
authRoutes.post("/forgot-password", validate(forgotPasswordSchema), asyncHandler(authController.forgotPassword));
authRoutes.get("/me", requireAuth, asyncHandler(authController.me));
authRoutes.post("/logout", asyncHandler(authController.logout));
