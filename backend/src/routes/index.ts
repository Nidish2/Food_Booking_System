import { Router } from "express";
import { authRoutes } from "./auth.routes.js";
import { bookingRoutes } from "./booking.routes.js";
import { roomRoutes } from "./room.routes.js";
import { userRoutes } from "./user.routes.js";

export const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/rooms", roomRoutes);
routes.use("/bookings", bookingRoutes);
routes.use("/users", userRoutes);
