import type { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { httpStatus } from "../constants/httpStatus.js";
import { userRole } from "../constants/userRole.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyToken } from "../utils/jwt.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: "USER" | "ADMIN";
      };
    }
  }
}

const getBearerToken = (authorization?: string) => {
  if (!authorization?.startsWith("Bearer ")) return null;
  return authorization.split(" ")[1];
};

export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token ?? getBearerToken(req.headers.authorization);
    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Authentication required.");
    }

    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true, role: true }
    });

    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid authentication token.");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdmin = (req: Request, _res: Response, next: NextFunction) => {
  if (req.user?.role !== userRole.ADMIN) {
    next(new ApiError(httpStatus.FORBIDDEN, "Admin access required."));
    return;
  }
  next();
};
