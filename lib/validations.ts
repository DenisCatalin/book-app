import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  universityId: z.coerce.number(),
  universityCard: z.string().nonempty("University card is required"),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export const bookSchema = z.object({
  title: z.string().trim().max(100).min(3, { message: "Title must be at least 3 characters" }),
  author: z.string().trim().max(100).min(3, { message: "Author must be at least 3 characters" }),
  genre: z.string().trim().max(50).min(3, { message: "Genre must be at least 3 characters" }),
  rating: z.coerce.number().min(1).max(5, { message: "Rating must be between 1 and 5" }),
  availableCopies: z.coerce
    .number()
    .int()
    .positive()
    .lte(10000)
    .min(1, { message: "Total copies must be at least 1" }),
  description: z
    .string()
    .trim()
    .max(1000)
    .min(10, { message: "Description must be at least 10 characters" }),
  coverUrl: z.string().nonempty("Cover URL is required"),
  coverColor: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{6})$/i),
  videoUrl: z.string().nonempty("Video URL is required"),
  summary: z
    .string()
    .trim()
    .max(1000)
    .min(10, { message: "Summary must be at least 10 characters" }),
});
