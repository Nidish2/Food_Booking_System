export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-8 text-center transition-colors duration-300">
      <h3 className="text-lg font-extrabold tracking-tight text-brand-navy dark:text-white">{title}</h3>
      <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}
