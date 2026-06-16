export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return <div className="rounded-lg bg-white p-6 text-center text-slate-600">{message}</div>;
}
