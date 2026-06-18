import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { ErrorState } from "../components/common/ErrorState";
import { useAuth } from "../hooks/useAuth";
import { LoginPage } from "../pages/LoginPage";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading, authError } = useAuth();

  if (isLoading) {
    return <LoginPage />;
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

