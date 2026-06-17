import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { routes } from "./routes/index.js";
import { ApiError } from "./utils/ApiError.js";
import { httpStatus } from "./constants/httpStatus.js";

export const app = express();

import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

app.use(helmet());

const limiter = process.env.NODE_ENV === "test"
  ? (req: any, res: any, next: any) => next()
  : rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
      standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    });

// Apply the rate limiting middleware to all requests.
app.use(limiter);

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
