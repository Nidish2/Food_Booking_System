import { useState } from "react";
import { Outlet, useLocation, Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  BedDouble,
  PlusCircle,
  BookOpen,
  Users,
  UserCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon
} from "lucide-react";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

export function AppLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const isAdmin = user?.role === "ADMIN";

  const getPageTitle = () => {
    if (location.pathname === "/") return { title: "Rooms Dashboard", icon: <BedDouble className="h-5 w-5 text-brand-blue" /> };
    if (location.pathname.includes("rooms/add")) return { title: "Add Room", icon: <PlusCircle className="h-5 w-5 text-brand-blue" /> };
    if (location.pathname.includes("bookings")) return { title: isAdmin ? "All Bookings" : "My Bookings", icon: <BookOpen className="h-5 w-5 text-brand-blue" /> };
    if (location.pathname.includes("users")) return { title: "Users Management", icon: <Users className="h-5 w-5 text-brand-blue" /> };
    if (location.pathname.includes("profile")) return { title: "My Profile", icon: <UserCircle className="h-5 w-5 text-brand-blue" /> };
    return { title: "Hotel Operations", icon: <Building2 className="h-5 w-5 text-brand-blue" /> };
  };

  const { title, icon } = getPageTitle();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-brand-blue/5 dark:bg-brand-blue/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] h-[400px] w-[400px] rounded-full bg-brand-red/5 dark:bg-brand-red/10 blur-[100px] pointer-events-none" />

      {/* Left Sidebar */}
      <aside
        className={`sticky top-0 h-screen flex flex-col justify-between border-r border-slate-200/50 dark:border-white/5 bg-white/70 dark:bg-zinc-950/40 backdrop-blur-md text-slate-800 dark:text-white transition-all duration-300 z-40 shadow-lg ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div>
          <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between min-h-[65px]">
            {!collapsed && (
              <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue">
                  <Building2 className="h-4.5 w-4.5" />
                </div>
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent">
                  Hotel Booking
                </span>
              </Link>
            )}
            {collapsed && (
              <Link to="/" className="flex h-8 w-8 items-center justify-center mx-auto hover:opacity-90 transition-opacity">
                <Building2 className="h-6 w-6 text-brand-blue" />
              </Link>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-white/80 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          <nav className="py-6 px-3 space-y-1.5">
            <SidebarLink to="/" icon={<BedDouble className="h-5 w-5" />} label="Rooms" collapsed={collapsed} />
            {isAdmin && <SidebarLink to="/rooms/add" icon={<PlusCircle className="h-5 w-5" />} label="Add Room" collapsed={collapsed} />}
            <SidebarLink to="/bookings/history" icon={<BookOpen className="h-5 w-5" />} label={isAdmin ? "All Bookings" : "My Bookings"} collapsed={collapsed} />
            {isAdmin && <SidebarLink to="/admin/users" icon={<Users className="h-5 w-5" />} label="Users" collapsed={collapsed} />}
            <SidebarLink to="/profile" icon={<UserCircle className="h-5 w-5" />} label="Profile" collapsed={collapsed} />
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-white/5 space-y-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition text-sm font-semibold text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            {theme === "light" ? (
              <>
                <Moon className="h-5 w-5 text-slate-500 dark:text-slate-300" />
                {!collapsed && <span>Dark Mode</span>}
              </>
            ) : (
              <>
                <Sun className="h-5 w-5 text-amber-500 dark:text-amber-300" />
                {!collapsed && <span>Light Mode</span>}
              </>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-600 text-red-600 dark:text-red-400 hover:text-white transition text-sm font-semibold cursor-pointer"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Restored Old Header / Navbar */}
        <Navbar />

        <main className="flex-1 px-8 py-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        
        {/* Restored Footer */}
        <Footer />
      </div>
    </div>
  );
}

function SidebarLink({
  to,
  icon,
  label,
  collapsed
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}) {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20"
        : "text-slate-600 dark:text-white/70 hover:text-brand-blue dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
    }`;

  return (
    <NavLink to={to} className={navClass} title={collapsed ? label : undefined}>
      <span className="flex-shrink-0">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
}
