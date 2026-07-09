import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must contain at least 3 characters"),

  email: z
    .string()
    .email("Please enter a valid email"),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters"),

  fullName: z
    .string()
    .min(2, "Full name must contain at least 2 characters"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export type RegisterInput = z.infer<typeof registerSchema>; 