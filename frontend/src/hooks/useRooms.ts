import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { roomsApi } from "../api/rooms.api";
import type { RoomFilters } from "../types/room.types";

export function useRooms(filters?: RoomFilters) {
  const queryClient = useQueryClient();
  const roomsQuery = useQuery({
    queryKey: ["rooms", filters],
    queryFn: () => roomsApi.list(filters),
  });
  const roomTypesQuery = useQuery({
    queryKey: ["room-types"],
    queryFn: roomsApi.listTypes,
  });

  const createRoomMutation = useMutation({
    mutationFn: roomsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room-types"] });
    },
  });

  const updateRoomMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof roomsApi.update>[1];
    }) => roomsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room-types"] });
    },
  });

  return { roomsQuery, roomTypesQuery, createRoomMutation, updateRoomMutation };
}
