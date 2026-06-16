import { zodResolver } from "@hookform/resolvers/zod";
import { Building2 } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/auth.api";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { PublicLayout } from "../components/layout/PublicLayout";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../schemas/auth.schema";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await authApi.forgotPassword(values);
      toast.success("If this email exists, a reset link would be sent.");
      navigate("/login");
    } catch (error) {
      if (error instanceof Error && error.message.includes("Network")) {
        toast.error(
          "Network error. Please check your connection and make sure the backend is running.",
        );
        return;
      }

      toast.error("Unable to submit reset request. Please try again.");
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
            Reset Password
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Secure reset request flow without SMTP integration.
          </p>
        </div>
        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>
        <Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </Button>
        <p className="mt-4 text-center text-sm text-slate-600">
          Remembered it?{" "}
          <Link to="/login" className="font-semibold text-brand-blue">
            Sign in
          </Link>
        </p>
      </form>
    </PublicLayout>
  );
}
