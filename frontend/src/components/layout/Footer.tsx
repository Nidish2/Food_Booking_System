import { Building2 } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-border bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-1 px-4 py-5 text-sm text-slate-600 text-center">
        <div className="flex items-center gap-2 font-semibold text-brand-navy">
          <Building2 className="h-4 w-4 text-brand-blue" />
          <span>Hotel Booking System</span>
        </div>
        <p>&copy; {currentYear} Hotel Booking System. All rights reserved.</p>
      </div>
    </footer>
  );
}
