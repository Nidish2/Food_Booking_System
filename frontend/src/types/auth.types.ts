export type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};

export type AuthResponse = {
  user: User;
};

export type ForgotPasswordResponse = {
  resetUrl?: string;
  previewUrl?: string;
  success?: boolean;
};

export type AdminUser = User & {
  createdAt: string;
  _count: {
    bookings: number;
  };
};
