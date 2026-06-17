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

import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

app.use(helmet());

const limiter = process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
  ? (req: any, res: any, next: any) => next()
  : rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      limit: 1000, // Global limit of 1000 requests per 15 minutes
      standardHeaders: "draft-7",
      legacyHeaders: false,
      message: {
        success: false,
        message: "Too many requests, please try again later."
      }
    });

// Apply the rate limiting middleware to all requests.
app.use(limiter);
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
