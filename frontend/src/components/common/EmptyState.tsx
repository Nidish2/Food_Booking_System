export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-brand-border bg-white p-8 text-center">
      <h3 className="text-lg font-semibold text-brand-navy">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{message}</p>
    </div>
  );
}
