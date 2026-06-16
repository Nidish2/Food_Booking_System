import { Building2 } from "lucide-react";
import { Footer } from "./Footer";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-light">
      <header className="border-b border-brand-border bg-brand-navy text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2 text-lg font-bold">
            <Building2 className="h-6 w-6" />
            Hotel Booking System
          </div>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
