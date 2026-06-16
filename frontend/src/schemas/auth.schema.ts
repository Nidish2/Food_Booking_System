import { z } from "zod";

const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/;
const commonPasswords = [
  "password",
  "123456",
  "12345678",
  "qwerty",
  "admin",
  "letmein",
];

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .refine((val) => passwordRegex.test(val), {
      message:
        "Password must include uppercase, lowercase, number, and special character.",
    })
    .refine((val) => !commonPasswords.includes(val.toLowerCase()), {
      message: "Choose a less common password.",
    }),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
