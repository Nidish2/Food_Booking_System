import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../api/users.api";

export function useUsers() {
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: usersApi.list
  });

  return { usersQuery };
}
