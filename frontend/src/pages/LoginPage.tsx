import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiErrorMessage } from "../api/apiClient";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { PublicLayout } from "../components/layout/PublicLayout";
import { useAuth } from "../hooks/useAuth";
import { loginSchema, type LoginFormValues } from "../schemas/auth.schema";

export function LoginPage() {
  const navigate = useNavigate();
  const { loginMutation, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await loginMutation.mutateAsync(values);
      toast.success("Welcome back.");
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error) && !error.response) {
        toast.error(
          "Network error. Please check your connection and make sure the backend is running.",
        );
        return;
      }

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Invalid email or password.");
        return;
      }

      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <PublicLayout>
      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-3xl bg-white dark:bg-zinc-900 shadow-[0_20px_50px_rgba(9,47,107,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-white/5 overflow-hidden transition-colors duration-300">
        {/* Left Side: Visual Image Banner */}
        <div
          className="hidden md:block relative bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80')",
          }}
        >
          {/* Glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-900/30 flex flex-col justify-end p-10 text-white">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-md border border-white/10">
                <Building2 className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
                Experience Luxury & Elegant Living
              </h2>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                Book premium suites and manage check-ins with our state-of-the-art reservation engine.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-zinc-900 transition-colors duration-300">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="text-center md:text-left">
              <div className="md:hidden mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-zinc-800 text-brand-navy dark:text-slate-200 border border-slate-100 dark:border-white/5">
                <Building2 className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Welcome Back
              </h1>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                Sign in to manage rooms and check bookings.
              </p>
            </div>

            <div className="space-y-4.5">
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                error={errors.email?.message}
                {...register("email")}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register("password")}
              />
            </div>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-brand-blue dark:text-blue-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={loginMutation.isPending}
            >
              Sign In
            </Button>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              New user?{" "}
              <Link
                to="/signup"
                className="font-semibold text-brand-blue dark:text-blue-400 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </PublicLayout>
  );
}
