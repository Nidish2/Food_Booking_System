import { Link, NavLink } from "react-router-dom";
import { Building2, UserCircle, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

export function Navbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20"
        : "text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/70 dark:bg-[#0a0a0a]/75 backdrop-blur-md shadow-[0_2px_20px_rgba(9,47,107,0.03)] border-b border-slate-200/50 dark:border-white/5 transition-all duration-300">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <Link to={user ? "/" : "/login"} className="flex items-center gap-2.5 text-lg font-bold tracking-tight hover:opacity-95 transition-opacity">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-blue/10 dark:bg-white/10 text-brand-blue dark:text-white backdrop-blur-sm">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="bg-gradient-to-r from-brand-navy to-[#0b3375] dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent font-extrabold tracking-tight">
            Hotel Booking
          </span>
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
            <span className="flex items-center gap-1">
              <UserCircle className="h-4.5 w-4.5" />
              <span>{user?.name}</span>
            </span>
          </NavLink>
 
          <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/15 mx-1" />
 
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition cursor-pointer"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4 text-slate-600" />
            ) : (
              <Sun className="h-4 w-4 text-amber-300" />
            )}
          </motion.button>
        </nav>
      </div>
    </header>
  );
}


