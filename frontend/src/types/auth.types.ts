export type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type AdminUser = User & {
  createdAt: string;
  _count: {
    bookings: number;
  };
};
