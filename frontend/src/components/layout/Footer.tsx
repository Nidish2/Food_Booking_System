import { Building2 } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/50 dark:border-white/5 bg-white/70 dark:bg-zinc-950/40 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-1 px-4 py-5 text-xs text-slate-500 dark:text-slate-400 text-center">
        <div className="flex items-center gap-2 font-semibold text-brand-blue dark:text-slate-300">
          <Building2 className="h-4 w-4" />
          <span>Hotel Booking System</span>
        </div>
        <p>&copy; {currentYear} Hotel Booking System. All rights reserved.</p>
      </div>
    </footer>
  );
}

