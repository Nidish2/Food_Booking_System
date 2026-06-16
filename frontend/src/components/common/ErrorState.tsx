export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm font-medium text-brand-danger">
      {message}
    </div>
  );
}
