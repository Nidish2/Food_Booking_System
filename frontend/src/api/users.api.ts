import { apiClient } from "./apiClient";
import type { AdminUser } from "../types/auth.types";

export const usersApi = {
  async list() {
    const { data } = await apiClient.get<{ data: { users: AdminUser[] } }>("/users");
    return data.data.users;
  }
};
