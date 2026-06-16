import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";

export function useAuth() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("hotel_token");

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: authApi.me,
    retry: false,
    enabled: Boolean(token),
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem("hotel_token", data.token);
      queryClient.setQueryData(["me"], data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      localStorage.setItem("hotel_token", data.token);
      queryClient.setQueryData(["me"], data.user);
    },
  });

  const logout = async () => {
    await authApi.logout();
    localStorage.removeItem("hotel_token");
    queryClient.clear();
  };

  return {
    user: meQuery.data,
    isAuthenticated: Boolean(token) && !meQuery.isError,
    isLoading: meQuery.isLoading,
    authError: meQuery.error,
    loginMutation,
    registerMutation,
    logout,
  };
}
