import { prisma } from "../config/prisma.js";
import { httpStatus } from "../constants/httpStatus.js";
import { userRole } from "../constants/userRole.js";
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
} from "../validators/auth.validator.js";
import { ApiError } from "../utils/ApiError.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import { isPwnedPassword } from "../utils/passwordStrength.js";

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
    await prisma.user.findUnique({
      where: { email: input.email },
    });
  },
};
