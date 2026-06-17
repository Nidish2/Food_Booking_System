import clsx from "clsx";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx("animate-pulse rounded-md bg-slate-200/80 dark:bg-zinc-800", className)}
    />
  );
}

export function RoomCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-zinc-900 p-5 shadow-sm transition-colors duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="w-1/2 space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-full" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="mt-4 flex gap-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="mt-6 flex items-center justify-between gap-3">
        <Skeleton className="h-7 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </div>
  );
}

export function RoomGridSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <RoomCardSkeleton />
      <RoomCardSkeleton />
      <RoomCardSkeleton />
    </div>
  );
}

export function BookingHistorySkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-4 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div className="space-y-2 w-1/2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-6 w-full" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}
