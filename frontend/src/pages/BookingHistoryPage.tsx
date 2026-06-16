import { useState } from "react";
import { BookingHistoryTable } from "../components/bookings/BookingHistoryTable";
import { Button } from "../components/common/Button";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { useBookings } from "../hooks/useBookings";
import type { BookingDisplayStatus } from "../types/booking.types";

export function BookingHistoryPage() {
  const [status, setStatus] = useState<BookingDisplayStatus>("ALL");
  const { historyQuery } = useBookings(status);
  const statuses: BookingDisplayStatus[] = ["ALL", "UPCOMING", "ACTIVE", "COMPLETED", "CANCELLED"];

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold text-brand-blue">Bookings</p>
        <h1 className="text-3xl font-bold text-brand-navy">Booking History</h1>
        <p className="mt-1 text-slate-600">Review confirmed room bookings and guest details.</p>
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        {statuses.map((item) => (
          <Button key={item} variant={status === item ? "primary" : "secondary"} onClick={() => setStatus(item)}>
            {item}
          </Button>
        ))}
      </div>

      {historyQuery.isLoading ? <LoadingState message="Loading booking history..." /> : null}
      {historyQuery.isError ? <ErrorState message="Unable to load booking history." /> : null}
      {historyQuery.data?.length === 0 ? (
        <EmptyState title="No bookings yet" message="Create a room booking to see history here." />
      ) : null}
      {historyQuery.data && historyQuery.data.length > 0 ? (
        <BookingHistoryTable bookings={historyQuery.data} />
      ) : null}
    </section>
  );
}
