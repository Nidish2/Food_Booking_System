import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { routes } from "./routes/index.js";
import { ApiError } from "./utils/ApiError.js";
import { httpStatus } from "./constants/httpStatus.js";

export const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "Hotel Booking API is healthy." });
});

app.use("/api", routes);

app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Route not found."));
});

app.use(errorHandler);
