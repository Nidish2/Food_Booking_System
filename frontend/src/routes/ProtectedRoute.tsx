import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { LoadingState } from "../components/common/LoadingState";
import { ErrorState } from "../components/common/ErrorState";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading, authError } = useAuth();

  if (isLoading) {
    return <LoadingState message="Checking your session..." />;
  }

  if (authError) {
    if (axios.isAxiosError(authError) && authError.response?.status === 401) {
      return <Navigate to="/login" replace />;
    }
    return (
      <ErrorState message="Unable to verify your session. Check your network or backend and try again." />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

