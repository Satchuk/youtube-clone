import { z } from "zod";

export const createChannelSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Channel name must be at least 2 characters")
      .max(100, "Channel name cannot exceed 100 characters"),

    handle: z
      .string()
      .min(3, "Handle must be at least 3 characters")
      .max(30, "Handle cannot exceed 30 characters")
      .regex(
        /^[a-zA-Z0-9._-]+$/,
        "Handle can only contain letters, numbers, dots, underscores and hyphens"
      ),

    description: z
      .string()
      .max(1000, "Description cannot exceed 1000 characters")
      .optional(),

    avatarUrl: z
      .string()
      .url("Avatar URL must be valid")
      .optional(),

    bannerUrl: z
      .string()
      .url("Banner URL must be valid")
      .optional(),
  }),
});

export const updateChannelSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .min(2, "Channel name must be at least 2 characters")
        .max(100, "Channel name cannot exceed 100 characters")
        .optional(),

      handle: z
        .string()
        .min(3, "Handle must be at least 3 characters")
        .max(30, "Handle cannot exceed 30 characters")
        .regex(
          /^[a-zA-Z0-9._-]+$/,
          "Handle can only contain letters, numbers, dots, underscores and hyphens"
        )
        .optional(),

      description: z
        .string()
        .max(1000, "Description cannot exceed 1000 characters")
        .optional(),

      avatarUrl: z
        .string()
        .url("Avatar URL must be valid")
        .optional(),

      bannerUrl: z
        .string()
        .url("Banner URL must be valid")
        .optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      {
        message: "At least one field is required to update the channel",
      }
    ),
});