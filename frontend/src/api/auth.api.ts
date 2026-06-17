import { apiClient } from "./apiClient";
import type { AuthResponse, ForgotPasswordResponse } from "../types/auth.types";

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
    const { data } = await apiClient.post<{ data: ForgotPasswordResponse }>("/auth/forgot-password", payload);
    return data.data;
  },

  async resetPassword(payload: { token: string; password: string }) {
    await apiClient.post("/auth/reset-password", payload);
  }
};
