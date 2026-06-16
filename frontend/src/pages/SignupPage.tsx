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
import { signupSchema, type SignupFormValues } from "../schemas/auth.schema";

export function SignupPage() {
  const navigate = useNavigate();
  const { registerMutation } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      await registerMutation.mutateAsync(values);
      toast.success("Account created successfully.");
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error) && !error.response) {
        toast.error(
          "Network error. Please check your connection and make sure the backend is running.",
        );
        return;
      }

      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast.error(
          "Unable to create account. If you already have an account, try signing in or use a different email.",
        );
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
            Create Account
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Start booking and tracking rooms.
          </p>
        </div>
        <div className="space-y-4">
          <Input
            label="Name"
            error={errors.name?.message}
            {...register("name")}
          />
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
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Creating..." : "Create Account"}
        </Button>
        <p className="mt-4 text-center text-sm text-slate-600">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-brand-blue">
            Sign in
          </Link>
        </p>
      </form>
    </PublicLayout>
  );
}
