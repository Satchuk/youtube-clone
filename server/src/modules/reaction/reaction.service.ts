import prisma from "../../config/prisma";

type ReactionType = "LIKE" | "DISLIKE";

export const reactToVideoService = async (
  userId: string,
  videoId: string,
  type: ReactionType
) => {
  // Check whether video exists
  const video = await prisma.video.findUnique({
    where: {
      id: videoId,
    },
  });

  if (!video) {
    throw new Error("VIDEO_NOT_FOUND");
  }

  // Check existing reaction from this user
  const existingReaction = await prisma.reaction.findUnique({
    where: {
      userId_videoId: {
        userId,
        videoId,
      },
    },
  });

  // No existing reaction → create new like/dislike
  if (!existingReaction) {
    return prisma.reaction.create({
      data: {
        userId,
        videoId,
        type,
      },
    });
  }

  // Same reaction clicked again → remove it (toggle off)
  if (existingReaction.type === type) {
    await prisma.reaction.delete({
      where: {
        userId_videoId: {
          userId,
          videoId,
        },
      },
    });

    return null;
  }

  // Different reaction → switch LIKE ↔ DISLIKE
  return prisma.reaction.update({
    where: {
      userId_videoId: {
        userId,
        videoId,
      },
    },
    data: {
      type,
    },
  });
};

export const getVideoReactionsService = async (
  videoId: string,
  userId?: string
) => {
  // Check whether video exists
  const video = await prisma.video.findUnique({
    where: {
      id: videoId,
    },
  });

  if (!video) {
    throw new Error("VIDEO_NOT_FOUND");
  }

  const [likeCount, dislikeCount, userReaction] = await Promise.all([
    prisma.reaction.count({
      where: {
        videoId,
        type: "LIKE",
      },
    }),

    prisma.reaction.count({
      where: {
        videoId,
        type: "DISLIKE",
      },
    }),

    userId
      ? prisma.reaction.findUnique({
          where: {
            userId_videoId: {
              userId,
              videoId,
            },
          },
        })
      : Promise.resolve(null),
  ]);

  return {
    likeCount,
    dislikeCount,
    myReaction: userReaction?.type ?? null,
  };
};