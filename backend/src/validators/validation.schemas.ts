import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2, "fullName must be at least 2 characters").max(100),
  name: z.string().min(2).max(100).optional(), // alias for fullName
  email: z.string().email("Invalid email format"),
  userName: z
    .string()
    .trim()
    .min(3, "userName must be at least 3 characters")
    .max(32)
    .regex(/^[a-zA-Z0-9._-]+$/, "userName can only contain letters, numbers, dots, underscores and hyphens")
    .optional(),
  identityUid: z
    .string()
    .trim()
    .regex(/^\d{12}$/, "CCCD must contain exactly 12 digits")
    .optional(),
  schoolName: z.string().trim().max(150).optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format").optional(),
  userName: z.string().trim().min(1).optional(),
  identityUid: z.string().trim().min(1).optional(),
  identifier: z.string().trim().min(1).optional(),
  password: z.string().min(1, "Password is required"),
}).refine((data) => data.email || data.userName || data.identityUid || data.identifier, {
  message: "email, userName, identityUid or identifier is required",
});

export const googleLoginSchema = z.object({
  credential: z.string().min(1, "Google credential is required"),
});

export const refreshTokenSchema = z.object({
  refresh_token: z.string().min(1, "refresh_token is required"),
});

export const paperQuerySchema = z.object({
  keyword: z.string().max(200).optional(),
  query: z.string().max(200).optional(),
  year: z
    .string()
    .regex(/^\d{4}$/, "year must be a 4-digit number")
    .optional(),
  author: z.string().max(100).optional(),
  page: z
    .string()
    .regex(/^\d+$/, "page must be a positive integer")
    .optional()
    .default("1"),
  limit: z
    .string()
    .regex(/^\d+$/, "limit must be a positive integer")
    .optional()
    .default("10"),
});

export const bookmarkSchema = z.object({
  paperId: z.string().uuid("paperId must be a valid UUID"),
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, "fullName must be at least 2 characters").max(100).optional(),
  email: z.string().email("Invalid email format").optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters").max(128),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});


