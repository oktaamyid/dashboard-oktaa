import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(['Website', 'Mobile', 'Other']),
  year: z.string().min(4, "Year is required"),
  image: z.string().optional(),
  description: z.string().min(1, "Description (EN) is required"),
  description_id: z.string().optional(),
  link: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  technology: z.array(z.string()).min(1, "At least one technology is required"),
});

export const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  year: z.string().min(1, "Year is required"),
  description: z.string().min(1, "Description (EN) is required"),
  description_id: z.string().optional(),
  logo: z.string().optional(),
  link: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  techStack: z.array(z.string()).min(1, "At least one technology is required"),
});

export const linkSchema = z.object({
  originalUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  shortUrl: z.string().min(1, "Short URL is required").regex(/^[a-zA-Z0-9-_]+$/, "Only alphanumeric, dash, and underscore allowed"),
  description: z.string().optional(),
  isPinned: z.boolean(),
  showToPortal: z.boolean(),
  category: z.string().optional(),
  price: z.number().min(0).optional(),
  nameUrl: z.string().optional(),
  useMultipleUrls: z.boolean(),
  multipleUrls: z.array(z.object({
    url: z.string().url("Must be a valid URL"),
    name: z.string().optional(),
  })).optional(),
  showConfirmationPage: z.boolean(),
  confirmationPageSettings: z.object({
    customMessage: z.string().optional(),
  }).optional(),
}).refine((data) => {
  if (!data.useMultipleUrls && !data.originalUrl) {
    return false;
  }
  return true;
}, {
  message: "Original URL is required when not using multiple URLs",
  path: ["originalUrl"],
}).refine((data) => {
  if (data.useMultipleUrls && (!data.multipleUrls || data.multipleUrls.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "At least one URL is required when using multiple URLs",
  path: ["multipleUrls"],
});

export const apiFieldSchema = z.object({
  fieldName: z.string().min(1, "Field name is required"),
  type: z.enum(["text", "number", "boolean", "date"]),
  required: z.boolean(),
  defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
});

export const apiEndpointSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-zA-Z0-9-_]+$/, "Invalid slug format"),
  method: z.enum(["GET", "POST"]),
  fields: z.array(apiFieldSchema),
});

export const profileSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  spotify: z.string().optional(),
  github: z.string().optional(),
  tiktok: z.string().optional(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
export type ExperienceFormData = z.infer<typeof experienceSchema>;
export type LinkFormData = z.infer<typeof linkSchema>;
export type ApiEndpointFormData = z.infer<typeof apiEndpointSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
