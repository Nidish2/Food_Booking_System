import { Badge } from "../components/common/Badge";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { useUsers } from "../hooks/useUsers";
import { formatDate } from "../utils/date";
import { motion, AnimatePresence } from "framer-motion";

export function UsersPage() {
  const { usersQuery } = useUsers();

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-brand-blue dark:text-blue-400">Admin</p>
        <h1 className="mt-1 text-3xl font-extrabold text-brand-navy dark:text-white tracking-tight">Registered Users</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium">View users and booking counts for hotel operations.</p>
      </div>

      <AnimatePresence mode="popLayout">
        {usersQuery.isLoading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LoadingState message="Loading users..." />
          </motion.div>
        ) : usersQuery.isError ? (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ErrorState message="Unable to load users." />
          </motion.div>
        ) : usersQuery.data?.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EmptyState title="No users" message="Users will appear after signup." />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {usersQuery.data?.map((user, idx) => (
              <motion.article
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                whileHover={{ y: -3 }}
                className="flex flex-col justify-between rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-zinc-900 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-[0_15px_30px_rgba(9,47,107,0.04)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] transition-all duration-300"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 border-b border-slate-50 dark:border-white/5 pb-4">
                    <div>
                      <h2 className="text-lg font-extrabold text-brand-navy dark:text-white tracking-tight">{user.name}</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{user.email}</p>
                    </div>
                    <Badge tone={user.role === "ADMIN" ? "warning" : "neutral"}>{user.role}</Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm font-semibold">
                    <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/50 p-3.5 border border-slate-100/30 dark:border-white/5">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Bookings</p>
                      <p className="text-lg font-extrabold text-brand-navy dark:text-white mt-1">{user._count.bookings}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 dark:bg-zinc-800/50 p-3.5 border border-slate-100/30 dark:border-white/5">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Joined</p>
                      <p className="text-sm font-bold text-brand-navy dark:text-white mt-1.5">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

