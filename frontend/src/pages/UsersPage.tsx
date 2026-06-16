import { Badge } from "../components/common/Badge";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { useUsers } from "../hooks/useUsers";
import { formatDate } from "../utils/date";

export function UsersPage() {
  const { usersQuery } = useUsers();

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold text-brand-blue">Admin</p>
        <h1 className="text-3xl font-bold text-brand-navy">Registered Users</h1>
        <p className="mt-1 text-slate-600">View users and booking counts for hotel operations.</p>
      </div>

      {usersQuery.isLoading ? <LoadingState message="Loading users..." /> : null}
      {usersQuery.isError ? <ErrorState message="Unable to load users." /> : null}
      {usersQuery.data?.length === 0 ? <EmptyState title="No users" message="Users will appear after signup." /> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {usersQuery.data?.map((user) => (
          <article key={user.id} className="rounded-lg border border-brand-border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-brand-navy">{user.name}</h2>
                <p className="text-sm text-slate-600">{user.email}</p>
              </div>
              <Badge tone={user.role === "ADMIN" ? "warning" : "neutral"}>{user.role}</Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md bg-brand-light p-3">
                <p className="text-slate-500">Bookings</p>
                <p className="font-bold text-brand-navy">{user._count.bookings}</p>
              </div>
              <div className="rounded-md bg-brand-light p-3">
                <p className="text-slate-500">Joined</p>
                <p className="font-bold text-brand-navy">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
