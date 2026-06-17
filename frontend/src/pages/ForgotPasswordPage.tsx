import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Mail, ArrowLeft, ExternalLink } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { PublicLayout } from "../components/layout/PublicLayout";
import { useForgotPassword } from "../hooks/useForgotPassword";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../schemas/auth.schema";

export function ForgotPasswordPage() {
  const { submitForgotPassword, isSubmitting, previewUrl } = useForgotPassword();
  const [isSent, setIsSent] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    await submitForgotPassword(values);
    setIsSent(true);
  };

  return (
    <PublicLayout>
      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-3xl bg-white dark:bg-zinc-900 shadow-[0_20px_50px_rgba(9,47,107,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-white/5 overflow-hidden transition-colors duration-300">
        {/* Left Side: Visual Image Banner */}
        <div
          className="hidden md:block relative bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80')",
          }}
        >
          {/* Glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-900/30 flex flex-col justify-end p-10 text-white">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-md border border-white/10">
                <Building2 className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
                Secure Account Recovery
              </h2>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                Verify your credentials securely. If you have any issues, contact our support team.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form / Success content */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-zinc-900 transition-colors duration-300">
          <AnimatePresence mode="wait">
            {!isSent ? (
              <motion.div
                key="request-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="text-center md:text-left">
                    <div className="md:hidden mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-zinc-800 text-brand-navy dark:text-slate-200 border border-slate-100 dark:border-white/5">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      Reset Password
                    </h1>
                    <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                      Enter your email to receive a password reset link.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="name@example.com"
                      error={errors.email?.message}
                      {...register("email")}
                    />
                  </div>

                  <Button type="submit" className="w-full" isLoading={isSubmitting}>
                    Send Reset Link
                  </Button>

                  <div className="flex items-center justify-center md:justify-start pt-2">
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-blue dark:hover:text-blue-400 transition"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back to sign in</span>
                    </Link>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                className="text-center md:text-left space-y-6"
              >
                <div className="mx-auto md:mx-0 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 border border-emerald-100 dark:border-emerald-500/20 animate-bounce">
                  <Mail className="h-8 w-8" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Check your email
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    If an account exists for that email, we have sent a secure link to reset your password.
                  </p>
                </div>

                {previewUrl ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-xl border border-dashed border-brand-blue/30 dark:border-blue-500/20 bg-brand-blue/[0.02] dark:bg-blue-500/[0.02] p-4 text-left space-y-2"
                  >
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-blue dark:text-blue-400">Development Sandbox</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      The email reset link was intercepted locally. You can open and review the Ethereal message:
                    </p>
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-white hover:text-brand-blue dark:hover:text-blue-400 transition bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 shadow-sm"
                    >
                      <span>Inspect Ethereal Mail</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </motion.div>
                ) : null}

                <div className="border-t border-slate-100 dark:border-white/5 pt-6">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-blue dark:hover:text-blue-400 transition"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Return to Sign In</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PublicLayout>
  );
}
