import { prisma } from "../config/prisma.js";
import { httpStatus } from "../constants/httpStatus.js";
import type { CreateRoomInput } from "../validators/room.validator.js";
import type { UpdateRoomInput } from "../validators/room.validator.js";
import { ApiError } from "../utils/ApiError.js";
import { toDateOnly } from "../utils/date.js";

type RoomFilters = {
  checkInDate?: string;
  checkOutDate?: string;
  type?: string;
  capacity?: string;
  minPrice?: string;
  maxPrice?: string;
  availableOnly?: string;
};

export const roomService = {
  async listRoomTypes() {
    const roomTypes = await prisma.room.groupBy({
      by: ["type"],
      orderBy: { type: "asc" },
    });

    return roomTypes.map((roomType) => roomType.type);
  },

  async listRooms(filters: RoomFilters = {}) {
    const checkInDate = filters.checkInDate
      ? toDateOnly(filters.checkInDate)
      : null;
    const checkOutDate = filters.checkOutDate
      ? toDateOnly(filters.checkOutDate)
      : null;
    const shouldFilterAvailability = Boolean(
      checkInDate && checkOutDate && filters.availableOnly !== "false",
    );

    return prisma.room.findMany({
      where: {
        type: filters.type
          ? { contains: filters.type, mode: "insensitive" }
          : undefined,
        capacity: filters.capacity
          ? { gte: Number(filters.capacity) }
          : undefined,
        pricePerNight: {
          gte: filters.minPrice ? Number(filters.minPrice) : undefined,
          lte: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        },
        bookings: shouldFilterAvailability
          ? {
              none: {
                status: "CONFIRMED",
                checkInDate: { lt: checkOutDate! },
                checkOutDate: { gt: checkInDate! },
              },
            }
          : undefined,
      },
      orderBy: { roomNumber: "asc" },
      include: {
        bookings: {
          where: { status: "CONFIRMED" },
          select: {
            id: true,
            checkInDate: true,
            checkOutDate: true,
            status: true,
          },
        },
        reviews: {
          include: {
            user: { select: { name: true } },
            booking: { select: { checkInDate: true, checkOutDate: true } }
          },
          orderBy: { createdAt: "desc" }
        },
      },
    });
  },

  async getRoom(id: string) {
    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) {
      throw new ApiError(httpStatus.NOT_FOUND, "Room not found.");
    }
    return room;
  },

  async createRoom(input: CreateRoomInput, createdById: string) {
    const existingRoom = await prisma.room.findUnique({
      where: { roomNumber: input.roomNumber },
    });

    if (existingRoom) {
      throw new ApiError(httpStatus.CONFLICT, "Room number already exists.");
    }

    return prisma.room.create({
      data: {
        roomNumber: input.roomNumber,
        type: input.type,
        capacity: input.capacity,
        pricePerNight: input.pricePerNight,
        description: input.description || null,
        createdById,
      },
    });
  },

  async updateRoom(id: string, input: UpdateRoomInput) {
    await this.getRoom(id);

    if (input.roomNumber) {
      const existingRoom = await prisma.room.findUnique({
        where: { roomNumber: input.roomNumber },
      });
      if (existingRoom && existingRoom.id !== id) {
        throw new ApiError(httpStatus.CONFLICT, "Room number already exists.");
      }
    }

    return prisma.room.update({
      where: { id },
      data: {
        roomNumber: input.roomNumber,
        type: input.type,
        capacity: input.capacity,
        pricePerNight: input.pricePerNight,
        description: input.description === "" ? null : input.description,
      },
    });
  },
};
