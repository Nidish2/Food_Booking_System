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
    <section className="mx-auto max-w-2xl">
      <div className="mb-6">
        <p className="text-sm font-semibold text-brand-blue">Account</p>
        <h1 className="text-3xl font-bold text-brand-navy">User Profile</h1>
        <p className="mt-1 text-slate-600">
          Review signed-in user details and role permissions.
        </p>
      </div>
      <div className="rounded-lg border border-brand-border bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-brand-navy">{user?.name}</h2>
            <p className="mt-1 text-slate-600">{user?.email}</p>
          </div>
          <Badge tone={user?.role === "ADMIN" ? "warning" : "neutral"}>
            {user?.role}
          </Badge>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-md bg-brand-light p-4">
            <p className="text-sm text-slate-500">Access</p>
            <p className="mt-1 font-semibold text-brand-navy">
              {user?.role === "ADMIN"
                ? "Manage rooms, users, and bookings"
                : "Book rooms and view own history"}
            </p>
          </div>
          <div className="rounded-md bg-brand-light p-4">
            <p className="text-sm text-slate-500">Privacy</p>
            <p className="mt-1 font-semibold text-brand-navy">
              Internal identifiers are hidden from the profile view.
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </section>
  );
}
