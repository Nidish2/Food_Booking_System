import { z } from "zod";

const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/;
const commonPasswords = [
  "123456",
  "123456789",
  "qwerty",
  "password",
  "12345678",
  "111111",
  "1234567",
  "sunshine",
  "qwerty123",
  "iloveyou",
  "princess",
  "admin",
  "welcome",
  "666666",
  "abc123",
  "123123",
  "football",
  "1234",
  "passw0rd",
  "master",
  "hello",
  "freedom",
  "whatever",
  "qazwsx",
  "trustno1",
  "654321",
  "jordan23",
  "harley",
  "loveme",
  "zaq1zaq1",
  "charlie",
  "aa123456",
  "donald",
  "password1",
  "password123",
  "123qwe",
  "monkey",
  "dragon",
  "shadow",
  "baseball",
  "superman",
  "michael",
  "batman",
  "letmein",
  "hottie",
  "trustno1",
  "login",
  "welcome1",
  "qwertyuiop",
  "starwars",
  "1234567890",
];

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Name is required."),
    email: z
      .string()
      .trim()
      .email("Enter a valid email address.")
      .toLowerCase(),
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
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Enter a valid email address.")
      .toLowerCase(),
    password: z.string().min(1, "Password is required."),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Enter a valid email address.")
      .toLowerCase()
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(32, "Invalid reset token."),
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
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>["body"];
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>["body"];
