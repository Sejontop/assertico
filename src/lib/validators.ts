import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required")
});

export const signupSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be 72 characters or fewer")
});

export const urlSchema = z
  .string()
  .trim()
  .min(1, "URL is required")
  .url("Enter a valid URL, including http:// or https://");

export const collectionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  description: z
    .string()
    .trim()
    .max(500, "Description must be 500 characters or fewer")
    .optional()
});

export const savedRequestNameSchema = z
  .string()
  .trim()
  .min(1, "Request name is required")
  .max(100, "Name must be 100 characters or fewer");

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type CollectionInput = z.infer<typeof collectionSchema>;
