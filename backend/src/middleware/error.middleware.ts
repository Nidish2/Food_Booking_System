import type { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { env } from "../config/env.js";
import { httpStatus } from "../constants/httpStatus.js";
import { ApiError } from "../utils/ApiError.js";

export const notFoundHandler: ErrorRequestHandler = (err, _req, _res, next) => {
  next(err);
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: env.NODE_ENV === "development" ? err.details : undefined
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    res.status(httpStatus.CONFLICT).json({
      success: false,
      message: "A record with this unique value already exists."
    });
    return;
  }

  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Something went wrong.",
    details: env.NODE_ENV === "development" ? String(err) : undefined
  });
};
