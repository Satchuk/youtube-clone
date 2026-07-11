import prisma from "../../config/prisma";
import { VideoVisibility } from "@prisma/client";

interface CreateVideoInput {
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  visibility?: VideoVisibility;
  channelId: string;
}

interface UpdateVideoInput {
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  visibility?: VideoVisibility;
}

export const createVideoService = async (
  userId: string,
  data: CreateVideoInput
) => {
  const channel = await prisma.channel.findUnique({
    where: {
      id: data.channelId,
    },
  });

  if (!channel) {
    throw new Error("CHANNEL_NOT_FOUND");
  }

  if (channel.ownerId !== userId) {
    throw new Error("FORBIDDEN");
  }

  const video = await prisma.video.create({
    data: {
      title: data.title,
      description: data.description,
      videoUrl: data.videoUrl,
      thumbnailUrl: data.thumbnailUrl,
      duration: data.duration,
      visibility: data.visibility,
      channelId: data.channelId,
      publishedAt:
        data.visibility === "PUBLIC" || !data.visibility
          ? new Date()
          : null,
    },
  });

  return video;
};

export const getVideosByChannelService = async (channelId: string) => {
  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId,
    },
    select: {
      id: true,
    },
  });

  if (!channel) {
    throw new Error("CHANNEL_NOT_FOUND");
  }

  const videos = await prisma.video.findMany({
    where: {
      channelId,
      visibility: "PUBLIC",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return videos;
};

export const getVideoByIdService = async (videoId: string) => {
  const video = await prisma.video.findUnique({
    where: {
      id: videoId,
    },
    include: {
      channel: {
        select: {
          id: true,
          name: true,
          handle: true,
          avatarUrl: true,
          isVerified: true,
        },
      },
    },
  });

  if (!video) {
    throw new Error("VIDEO_NOT_FOUND");
  }

  return video;
};

export const updateVideoService = async (
  videoId: string,
  userId: string,
  data: UpdateVideoInput
) => {
  const video = await prisma.video.findUnique({
    where: {
      id: videoId,
    },
    include: {
      channel: {
        select: {
          ownerId: true,
        },
      },
    },
  });

  if (!video) {
    throw new Error("VIDEO_NOT_FOUND");
  }

  if (video.channel.ownerId !== userId) {
    throw new Error("FORBIDDEN");
  }

  const updatedVideo = await prisma.video.update({
    where: {
      id: videoId,
    },
    data: {
      ...data,
      ...(data.visibility === "PUBLIC" &&
        video.publishedAt === null && {
          publishedAt: new Date(),
        }),
    },
  });

  return updatedVideo;
};

export const deleteVideoService = async (
  videoId: string,
  userId: string
) => {
  const video = await prisma.video.findUnique({
    where: {
      id: videoId,
    },
    include: {
      channel: {
        select: {
          ownerId: true,
        },
      },
    },
  });

  if (!video) {
    throw new Error("VIDEO_NOT_FOUND");
  }

  if (video.channel.ownerId !== userId) {
    throw new Error("FORBIDDEN");
  }

  await prisma.video.delete({
    where: {
      id: videoId,
    },
  });
};