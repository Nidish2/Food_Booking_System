import { useState } from "react";
import toast from "react-hot-toast";
import { authApi } from "../api/auth.api";
import type { ForgotPasswordFormValues } from "../schemas/auth.schema";

export function useForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();

  const submitForgotPassword = async (values: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await authApi.forgotPassword(values);
      // The backend now returns a previewUrl in dev mode if using Ethereal
      if (result?.previewUrl) {
        setPreviewUrl(result.previewUrl);
        // Show a dev-only toast if preview is available
        toast.success("Dev: Email preview generated.", { duration: 5000 });
      } else {
        // Standard success message
        toast.success("If an account exists, a password reset link has been sent.");
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("Network")) {
        toast.error(
          "Network error. Please check your connection and make sure the backend is running.",
        );
      } else {
        toast.error("Unable to submit reset request. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitForgotPassword,
    isSubmitting,
    previewUrl,
  };
}
