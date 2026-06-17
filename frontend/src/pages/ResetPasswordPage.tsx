import { zodResolver } from "@hookform/resolvers/zod";
import { Building2 } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
      toast.success("Password reset successful. Please sign in.");
      navigate("/login", { replace: true });
    } catch (error) {
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
            Set New Password
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Reset links expire after 15 minutes and work once.
          </p>
        </div>
        <div className="space-y-4">
          <input type="hidden" {...register("token")} />
          <Input
            label="New Password"
            type="password"
            error={errors.password?.message}
            {...register("password")}
          />
          {errors.token?.message ? (
            <p className="text-sm text-brand-danger">{errors.token.message}</p>
          ) : null}
        </div>
        <Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>
        <p className="mt-4 text-center text-sm text-slate-600">
          Need a new link?{" "}
          <Link to="/forgot-password" className="font-semibold text-brand-blue">
            Request reset
          </Link>
        </p>
      </form>
    </PublicLayout>
  );
}
