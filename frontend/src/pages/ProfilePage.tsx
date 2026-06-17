import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-brand-blue dark:text-blue-400">Account</p>
        <h1 className="mt-1 text-3xl font-extrabold text-brand-navy dark:text-white tracking-tight">User Profile</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Review signed-in user details and role permissions.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-colors duration-300">
        <div className="flex items-start justify-between gap-4 border-b border-slate-50 dark:border-white/5 pb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-brand-navy dark:text-white tracking-tight">{user?.name}</h2>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 font-medium">{user?.email}</p>
          </div>
          <Badge tone={user?.role === "ADMIN" ? "warning" : "neutral"}>
            {user?.role}
          </Badge>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/50 p-4 border border-slate-100/50 dark:border-white/5 transition-colors duration-300">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Access</p>
            <p className="mt-2 text-sm font-semibold text-brand-navy dark:text-slate-200">
              {user?.role === "ADMIN"
                ? "Manage rooms, users, and bookings"
                : "Book rooms and view own history"}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/50 p-4 border border-slate-100/50 dark:border-white/5 transition-colors duration-300">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Privacy</p>
            <p className="mt-2 text-sm font-semibold text-brand-navy dark:text-slate-200">
              Internal identifiers are hidden from the profile view.
            </p>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </section>
  );
}

