import { Link, NavLink, useNavigate } from "react-router-dom";
import { Building2, LogOut, UserCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../common/Button";
import { useAuth } from "../../hooks/useAuth";

export function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-semibold transition ${
      isActive ? "bg-white text-brand-navy" : "text-white hover:bg-white/10"
    }`;

  return (
    <header className="bg-brand-navy text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold">
          <Building2 className="h-6 w-6" />
          Hotel Booking System
        </Link>
        <nav className="flex flex-wrap items-center gap-2">
          <NavLink to="/" className={navClass}>
            Rooms
          </NavLink>
          {user?.role === "ADMIN" ? (
            <NavLink to="/rooms/add" className={navClass}>
              Add Room
            </NavLink>
          ) : null}
          <NavLink to="/bookings/history" className={navClass}>
            {user?.role === "ADMIN" ? "All Bookings" : "My Bookings"}
          </NavLink>
          {user?.role === "ADMIN" ? (
            <NavLink to="/admin/users" className={navClass}>
              Users
            </NavLink>
          ) : null}
          <NavLink to="/profile" className={navClass}>
            <UserCircle className="inline h-4 w-4" /> {user?.name}
          </NavLink>
          <Button variant="ghost" onClick={handleLogout} aria-label="Logout">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </nav>
      </div>
    </header>
  );
}
