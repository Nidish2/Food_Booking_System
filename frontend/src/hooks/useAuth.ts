import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";

export function useAuth() {
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: authApi.me,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      queryClient.setQueryData(["me"], data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      queryClient.setQueryData(["me"], data.user);
    },
  });

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      queryClient.setQueryData(["me"], null);
      queryClient.clear();
    }
  };

  return {
    user: meQuery.data,
    isAuthenticated: Boolean(meQuery.data) && !meQuery.isError,
    isLoading: meQuery.isLoading,
    authError: meQuery.error,
    loginMutation,
    registerMutation,
    logout,
  };
}
