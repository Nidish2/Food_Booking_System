import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { AddRoomPage } from "../pages/AddRoomPage";
import { BookingHistoryPage } from "../pages/BookingHistoryPage";
import { EditRoomPage } from "../pages/EditRoomPage";
import { UsersPage } from "../pages/UsersPage";
import { LoginPage } from "../pages/LoginPage";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import { ProfilePage } from "../pages/ProfilePage";
import { ResetPasswordPage } from "../pages/ResetPasswordPage";
import { RoomsPage } from "../pages/RoomsPage";
import { SignupPage } from "../pages/SignupPage";
import { ProtectedRoute } from "./ProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<RoomsPage />} />
          <Route path="/rooms/add" element={<AddRoomPage />} />
          <Route path="/rooms/:id/edit" element={<EditRoomPage />} />
          <Route path="/bookings/history" element={<BookingHistoryPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
