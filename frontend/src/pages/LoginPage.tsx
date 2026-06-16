import { zodResolver } from "@hookform/resolvers/zod";
import { Building2 } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
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
  const { loginMutation } = useAuth();
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm"
      >
        <div className="mb-6 text-center">
          <Building2 className="mx-auto h-10 w-10 text-brand-blue" />
          <h1 className="mt-3 text-2xl font-bold text-brand-navy">
            Hotel Booking System
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Sign in to manage rooms and bookings.
          </p>
        </div>
        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Password"
            type="password"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>
        <Button
          type="submit"
          className="mt-6 w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Signing in..." : "Sign In"}
        </Button>
        <p className="mt-4 text-center text-sm text-slate-600">
          New user?{" "}
          <Link to="/signup" className="font-semibold text-brand-blue">
            Create an account
          </Link>
        </p>
        <p className="mt-2 text-center text-sm">
          <Link to="/forgot-password" className="font-semibold text-brand-blue">
            Forgot password?
          </Link>
        </p>
      </form>
    </PublicLayout>
  );
}
