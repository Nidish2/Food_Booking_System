import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const userRoutes = Router();

userRoutes.use(requireAuth, requireAdmin);
userRoutes.get("/", asyncHandler(userController.listUsers));
