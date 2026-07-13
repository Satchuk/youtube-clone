import prisma from "../../config/prisma";

// ================================
// SUBSCRIBE TO CHANNEL
// ================================

export const subscribeToChannelService = async (
  subscriberId: string,
  channelId: string
) => {
  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  if (!channel) {
    throw new Error("CHANNEL_NOT_FOUND");
  }

  if (channel.ownerId === subscriberId) {
    throw new Error("CANNOT_SUBSCRIBE_OWN_CHANNEL");
  }

  const existingSubscription = await prisma.subscription.findUnique({
    where: {
      subscriberId_channelId: {
        subscriberId,
        channelId,
      },
    },
  });

  if (existingSubscription) {
    throw new Error("ALREADY_SUBSCRIBED");
  }

  return prisma.subscription.create({
    data: {
      subscriberId,
      channelId,
    },
  });
};

// ================================
// UNSUBSCRIBE FROM CHANNEL
// ================================

export const unsubscribeFromChannelService = async (
  subscriberId: string,
  channelId: string
) => {
  const existingSubscription = await prisma.subscription.findUnique({
    where: {
      subscriberId_channelId: {
        subscriberId,
        channelId,
      },
    },
  });

  if (!existingSubscription) {
    throw new Error("NOT_SUBSCRIBED");
  }

  return prisma.subscription.delete({
    where: {
      subscriberId_channelId: {
        subscriberId,
        channelId,
      },
    },
  });
};

// ================================
// CHECK SUBSCRIPTION STATUS
// ================================

export const getSubscriptionStatusService = async (
  subscriberId: string,
  channelId: string
) => {
  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  if (!channel) {
    throw new Error("CHANNEL_NOT_FOUND");
  }

  const subscription = await prisma.subscription.findUnique({
    where: {
      subscriberId_channelId: {
        subscriberId,
        channelId,
      },
    },
  });

  return {
    isSubscribed: Boolean(subscription),
  };
};

// ================================
// GET SUBSCRIBER COUNT
// ================================

export const getSubscriberCountService = async (
  channelId: string
) => {
  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  if (!channel) {
    throw new Error("CHANNEL_NOT_FOUND");
  }

  const subscriberCount = await prisma.subscription.count({
    where: {
      channelId,
    },
  });

  return {
    subscriberCount,
  };
};

// ================================
// GET MY SUBSCRIBED CHANNELS
// ================================

export const getMySubscriptionsService = async (
  subscriberId: string
) => {
  return prisma.subscription.findMany({
    where: {
      subscriberId,
    },
    include: {
      channel: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};