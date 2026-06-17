import { useState } from "react";
import { BookingHistoryTable } from "../components/bookings/BookingHistoryTable";
import { Button } from "../components/common/Button";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { BookingHistorySkeleton } from "../components/common/SkeletonLoader";
import { useBookings } from "../hooks/useBookings";
import type { BookingDisplayStatus } from "../types/booking.types";
import { motion, AnimatePresence } from "framer-motion";

export function BookingHistoryPage() {
  const [status, setStatus] = useState<BookingDisplayStatus>("ALL");
  const { historyQuery } = useBookings(status);
  const statuses: BookingDisplayStatus[] = ["ALL", "UPCOMING", "ACTIVE", "COMPLETED", "CANCELLED"];

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-brand-blue dark:text-blue-400">Bookings</p>
        <h1 className="mt-1 text-3xl font-extrabold text-brand-navy dark:text-white tracking-tight">Booking History</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Review confirmed room bookings and guest details.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {statuses.map((item) => (
          <Button
            key={item}
            variant={status === item ? "primary" : "secondary"}
            onClick={() => setStatus(item)}
            className="rounded-full text-xs"
          >
            {item}
          </Button>
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        {historyQuery.isLoading ? (
          <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <BookingHistorySkeleton />
          </motion.div>
        ) : historyQuery.isError ? (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ErrorState message="Unable to load booking history." />
          </motion.div>
        ) : historyQuery.data?.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EmptyState title="No bookings yet" message="Create a room booking to see history here." />
          </motion.div>
        ) : historyQuery.data ? (
          <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <BookingHistoryTable bookings={historyQuery.data} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

