import { prisma } from "../config/prisma.js";

export const userService = {
  async listUsers() {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { bookings: true }
        }
      }
    });
  }
};
