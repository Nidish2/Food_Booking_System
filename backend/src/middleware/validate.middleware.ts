import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject } from "zod";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";
import { httpStatus } from "../constants/httpStatus.js";

export const validate =
  (schema: AnyZodObject) => (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ApiError(httpStatus.BAD_REQUEST, "Validation failed.", error.flatten()));
        return;
      }
      next(error);
    }
  };
