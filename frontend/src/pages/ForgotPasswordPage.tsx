import { zodResolver } from "@hookform/resolvers/zod";
import { Building2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
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
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    await submitForgotPassword(values);
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
            Enter your email to receive a password reset link.
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
        {previewUrl ? (
          <div className="mt-4 rounded-md border border-brand-border bg-brand-light p-3 text-sm">
            <p className="font-semibold text-brand-navy">Dev Mode: Email Preview</p>
            <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-brand-blue hover:underline">
              View Email on Ethereal
            </a>
          </div>
        ) : null}
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
