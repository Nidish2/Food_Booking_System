import { apiClient } from "./apiClient";
import type { Room, RoomFilters } from "../types/room.types";

const cleanFilters = (filters?: RoomFilters) =>
  Object.fromEntries(
    Object.entries(filters ?? {}).filter(
      ([, value]) => value !== undefined && value !== "",
    ),
  );

export const roomsApi = {
  async listTypes() {
    const { data } = await apiClient.get<{ data: { roomTypes: string[] } }>(
      "/rooms/types",
    );
    return data.data.roomTypes;
  },

  async list(filters?: RoomFilters) {
    const { data } = await apiClient.get<{ data: { rooms: Room[] } }>(
      "/rooms",
      {
        params: cleanFilters(filters),
      },
    );
    return data.data.rooms;
  },

  async create(payload: {
    roomNumber: string;
    type: string;
    capacity: number;
    pricePerNight: number;
    description?: string;
  }) {
    const { data } = await apiClient.post<{ data: { room: Room } }>(
      "/rooms",
      payload,
    );
    return data.data.room;
  },

  async update(
    id: string,
    payload: {
      roomNumber?: string;
      type?: string;
      capacity?: number;
      pricePerNight?: number;
      description?: string;
    },
  ) {
    const { data } = await apiClient.patch<{ data: { room: Room } }>(
      `/rooms/${id}`,
      payload,
    );
    return data.data.room;
  },
};
