export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white dark:bg-zinc-900/50 p-8 text-center shadow-sm border border-slate-100/80 dark:border-white/5 transition-colors duration-300">
      <div className="relative mb-3 h-10 w-10">
        <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-zinc-800"></div>
        <div className="absolute inset-0 rounded-full border-4 border-brand-blue border-t-transparent animate-spin"></div>
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}

