import { z } from "zod";

// Auth
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Users
export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["SUPER_ADMIN", "EVENT_LEADER", "MANAGEMENT", "SOCIAL_MEDIA"]),
  isActive: z.boolean().default(true),
  avatarUrl: z.string().optional().nullable(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional().or(z.literal("")),
  role: z.enum(["SUPER_ADMIN", "EVENT_LEADER", "MANAGEMENT", "SOCIAL_MEDIA"]).optional(),
  isActive: z.boolean().optional(),
  avatarUrl: z.string().optional().nullable(),
});

// Events
export const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain lowercase letters, numbers, and dashes only"),
  shortDescription: z.string().min(10, "Short description is required"),
  fullDescription: z.string().min(20, "Full description is required"),
  posterUrl: z.string().optional().nullable(),
  categoryId: z.string().min(1, "Category is required"),
  tagIds: z.array(z.string()).default([]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  venue: z.string().min(2, "Venue is required"),
  registrationUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")).nullable(),
  registrationDeadline: z.string().optional().or(z.literal("")).nullable(),
  status: z.enum(["UPCOMING", "ONGOING", "PAST"]).default("UPCOMING"),
  isFeatured: z.boolean().default(false),
  isVisible: z.boolean().default(true),
  eventLeaderId: z.string().optional().nullable(),
});

// Categories & Tags
export const eventCategorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/),
  description: z.string().optional().nullable(),
});

export const eventTagSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/),
});

// Winners
export const winnerSchema = z.object({
  eventId: z.string().min(1, "Event is required"),
  name: z.string().min(2, "Winner name is required"),
  position: z.string().min(1, "Position is required"), // e.g. "1st", "2nd", "Winner"
  photoUrl: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  displayOrder: z.number().default(0),
});

// Team
export const teamCategorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/),
  displayOrder: z.number().default(0),
});

export const teamMemberSchema = z.object({
  name: z.string().min(2, "Member name is required"),
  photoUrl: z.string().optional().nullable(),
  designation: z.string().min(2, "Designation is required"),
  categoryId: z.string().min(1, "Team category is required"),
  description: z.string().optional().nullable(),
  email: z.string().email().optional().or(z.literal("")).nullable(),
  linkedinUrl: z.string().url().optional().or(z.literal("")).nullable(),
  githubUrl: z.string().url().optional().or(z.literal("")).nullable(),
  twitterUrl: z.string().url().optional().or(z.literal("")).nullable(),
  displayOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

// Carousel
export const carouselItemSchema = z.object({
  heading: z.string().min(3, "Heading is required"),
  description: z.string().min(5, "Description is required"),
  imageUrl: z.string().min(1, "Image is required"),
  ctaText: z.string().optional().nullable(),
  ctaLink: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().default(0),
});

// Site Settings
export const siteSettingsSchema = z.object({
  websiteName: z.string().min(2),
  orgName: z.string().min(2),
  logoUrl: z.string().optional().nullable(),
  faviconUrl: z.string().optional().nullable(),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional().nullable(),
  instagramUrl: z.string().url().optional().or(z.literal("")).nullable(),
  linkedinUrl: z.string().url().optional().or(z.literal("")).nullable(),
  githubUrl: z.string().url().optional().or(z.literal("")).nullable(),
  twitterUrl: z.string().url().optional().or(z.literal("")).nullable(),
  youtubeUrl: z.string().url().optional().or(z.literal("")).nullable(),
  address: z.string().optional().nullable(),
  aboutShort: z.string().optional().nullable(),
  aboutFull: z.string().optional().nullable(),
  footerText: z.string().optional().nullable(),
});

// Gallery Image
export const galleryImageSchema = z.object({
  title: z.string().optional().nullable(),
  url: z.string().min(1, "Image URL is required"),
  thumbnailUrl: z.string().optional().nullable(),
  eventId: z.string().optional().nullable(),
  category: z.enum(["EVENTS", "WINNERS", "TEAM"]).default("EVENTS"),
  year: z.number().default(2026),
  isFeatured: z.boolean().default(false),
});
