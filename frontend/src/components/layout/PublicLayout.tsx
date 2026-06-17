import React from "react";
import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { Footer } from "./Footer";
import { useAuth } from "../../hooks/useAuth";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative gradient glowing backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-brand-blue/5 dark:bg-brand-blue/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-brand-navy/5 dark:bg-brand-red/10 blur-[100px] pointer-events-none" />

      <header className="border-b border-slate-100 dark:border-white/5 bg-white/70 dark:bg-black/70 backdrop-blur-md sticky top-0 z-30 shadow-sm transition-colors duration-300">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            to={isAuthenticated ? "/" : "/login"}
            className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-brand-navy dark:text-white hover:opacity-90 transition-opacity cursor-pointer"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-navy dark:bg-white/10 text-white shadow-md backdrop-blur-sm">
              <Building2 className="h-5 w-5" />
            </div>
            <span>Hotel Booking</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full flex justify-center"
        >
          {children}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

