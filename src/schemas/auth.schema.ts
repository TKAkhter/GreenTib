import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must have at least one lowercase letter")
    .regex(/[A-Z]/, "Password must have at least one uppercase letter")
    .regex(/\d/, "Password must have at least one number")
    .regex(/[@$!%*?&]/, "Password must have at least one special character"),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name must be at least 1 characters"),
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must have at least one lowercase letter")
      .regex(/[A-Z]/, "Password must have at least one uppercase letter")
      .regex(/\d/, "Password must have at least one number")
      .regex(/[@$!%*?&]/, "Password must have at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type AuthSchema = z.infer<typeof authSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
