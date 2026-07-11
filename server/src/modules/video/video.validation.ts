import { z } from "zod";

export const createVideoSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, "Video title is required")
      .max(100, "Video title cannot exceed 100 characters"),

    description: z
      .string()
      .max(5000, "Description cannot exceed 5000 characters")
      .optional(),

    videoUrl: z
      .string()
      .url("Video URL must be valid"),

    thumbnailUrl: z
      .string()
      .url("Thumbnail URL must be valid")
      .optional(),

    duration: z
      .number()
      .int("Duration must be an integer")
      .positive("Duration must be greater than 0")
      .optional(),

    visibility: z
      .enum(["PUBLIC", "PRIVATE", "UNLISTED"])
      .optional(),

    channelId: z
      .string()
      .uuid("Invalid channel ID"),
  }),
});

export const updateVideoSchema = z.object({
  body: z
    .object({
      title: z
        .string()
        .min(1, "Video title is required")
        .max(100, "Video title cannot exceed 100 characters")
        .optional(),

      description: z
        .string()
        .max(5000, "Description cannot exceed 5000 characters")
        .optional(),

      thumbnailUrl: z
        .string()
        .url("Thumbnail URL must be valid")
        .optional(),

      visibility: z
        .enum(["PUBLIC", "PRIVATE", "UNLISTED"])
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required to update the video",
    }),
});