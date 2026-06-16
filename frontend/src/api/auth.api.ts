import { apiClient } from "./apiClient";
import type { AuthResponse } from "../types/auth.types";

export const authApi = {
  async register(payload: { name: string; email: string; password: string }) {
    const { data } = await apiClient.post<{ data: AuthResponse }>("/auth/register", payload);
    return data.data;
  },

  async login(payload: { email: string; password: string }) {
    const { data } = await apiClient.post<{ data: AuthResponse }>("/auth/login", payload);
    return data.data;
  },

  async me() {
    const { data } = await apiClient.get<{ data: { user: AuthResponse["user"] } }>("/auth/me");
    return data.data.user;
  },

  async logout() {
    await apiClient.post("/auth/logout");
  },

  async forgotPassword(payload: { email: string }) {
    await apiClient.post("/auth/forgot-password", payload);
  }
};
