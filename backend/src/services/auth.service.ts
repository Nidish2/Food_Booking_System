import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { httpStatus } from "../constants/httpStatus.js";
import { userRole } from "../constants/userRole.js";
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from "../validators/auth.validator.js";
import { ApiError } from "../utils/ApiError.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import { isPwnedPassword } from "../utils/passwordStrength.js";
import crypto from "crypto";

const sanitizeUser = (user: {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}) => user;

export const authService = {
  async register(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });
    if (existingUser) {
      throw new ApiError(httpStatus.CONFLICT, "Email is already registered.");
    }

    if (await isPwnedPassword(input.password)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "That password has appeared in a data breach. Choose a different password.",
      );
    }

    const passwordHash = await hashPassword(input.password);
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        role: userRole.USER,
      },
      select: { id: true, name: true, email: true, role: true },
    });
    const token = signToken({ userId: user.id, role: user.role });
    return { user: sanitizeUser(user), token };
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password.");
    }

    const isValidPassword = await verifyPassword(
      input.password,
      user.passwordHash,
    );
    if (!isValidPassword) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password.");
    }

    const token = signToken({ userId: user.id, role: user.role });
    return {
      user: sanitizeUser({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }),
      token,
    };
  },

  async forgotPassword(input: ForgotPasswordInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      // Standard security practice: return success even if user not found to prevent enumeration
      return { success: true };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt,
      },
    });

    const resetUrl = `${env.CLIENT_URL}/reset-password?token=${token}`;
    
    // Import dynamically to avoid circular dependencies if any, or just import at top.
    // Assuming emailService is imported at top.
    const { emailService } = await import("./email.service.js");
    const previewUrl = await emailService.sendPasswordResetEmail(user.email, resetUrl);

    return { 
      success: true,
      previewUrl // we can return previewUrl for dev purposes
    };
  },

  async resetPassword(input: ResetPasswordInput) {
    const tokenHash = crypto
      .createHash("sha256")
      .update(input.token)
      .digest("hex");

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Reset link is invalid or expired.");
    }

    if (await isPwnedPassword(input.password)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "That password has appeared in a data breach. Choose a different password.",
      );
    }

    const passwordHash = await hashPassword(input.password);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);
  },
};
