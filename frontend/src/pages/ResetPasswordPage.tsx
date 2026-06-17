import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { authApi } from "../api/auth.api";
import { getApiErrorMessage } from "../api/apiClient";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { PublicLayout } from "../components/layout/PublicLayout";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../schemas/auth.schema";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") ?? "";
  const isTokenMissing = token.length < 32;

  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      await authApi.resetPassword(values);
      toast.success("Password reset successful.");
      setIsSuccess(true);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  // Redirect to login after 2.5 seconds on success
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  return (
    <PublicLayout>
      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-3xl bg-white dark:bg-zinc-900 shadow-[0_20px_50px_rgba(9,47,107,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-white/5 overflow-hidden transition-colors duration-300">
        {/* Left Side: Visual Image Banner */}
        <div
          className="hidden md:block relative bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80')",
          }}
        >
          {/* Glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-900/30 flex flex-col justify-end p-10 text-white">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-md border border-white/10">
                <Building2 className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
                Establish New Security
              </h2>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                Choose a password that you do not use on other platforms. Keep your account secure.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form / Success / Error states */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-zinc-900 transition-colors duration-300">
          <AnimatePresence mode="wait">
            {isTokenMissing ? (
              <motion.div
                key="invalid-token"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center md:text-left space-y-6"
              >
                <div className="mx-auto md:mx-0 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 border border-amber-100 dark:border-amber-500/20">
                  <AlertTriangle className="h-7 w-7" />
                </div>

                <div className="space-y-2">
                  <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Invalid Reset Token
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    The password reset token is missing, expired, or invalid. Reset links are valid for single use and expire after 15 minutes.
                  </p>
                </div>

                <div className="pt-2">
                  <Link to="/forgot-password">
                    <Button className="w-full">
                      Request New Link
                    </Button>
                  </Link>
                </div>

                <div className="border-t border-slate-100 dark:border-white/5 pt-5">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-blue dark:hover:text-blue-400 transition"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Return to Sign In</span>
                  </Link>
                </div>
              </motion.div>
            ) : isSuccess ? (
              <motion.div
                key="success-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center md:text-left space-y-6 py-4"
              >
                <div className="mx-auto md:mx-0 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 border border-emerald-100 dark:border-emerald-500/20 animate-bounce">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Password Reset Successful
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Your account security details have been updated. Redirecting you to sign in...
                  </p>
                </div>

                <div className="flex justify-center md:justify-start pt-2">
                  <div className="h-1.5 w-24 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: "0%" }}
                      transition={{ duration: 2.2, ease: "easeInOut" }}
                      className="h-full bg-emerald-500"
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="reset-form"
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
                      Set New Password
                    </h1>
                    <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                      Choose a password with uppercase letters, numbers, and special characters.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <input type="hidden" {...register("token")} />
                    <Input
                      label="New Password"
                      type="password"
                      placeholder="••••••••"
                      error={errors.password?.message}
                      {...register("password")}
                    />
                    {errors.token?.message ? (
                      <p className="text-xs font-semibold text-brand-red">{errors.token.message}</p>
                    ) : null}
                  </div>

                  <Button type="submit" className="w-full" isLoading={isSubmitting}>
                    Reset Password
                  </Button>

                  <div className="flex items-center justify-center md:justify-start pt-2">
                    <Link
                      to="/forgot-password"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-blue dark:hover:text-blue-400 transition"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Request new link</span>
                    </Link>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PublicLayout>
  );
}
