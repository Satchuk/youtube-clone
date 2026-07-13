import prisma from "../../config/prisma";

export const subscribeToChannelService = async (
  subscriberId: string,
  channelId: string
) => {
  // 1. Check whether the channel exists
  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  if (!channel) {
    throw new Error("CHANNEL_NOT_FOUND");
  }

  // 2. Prevent user from subscribing to their own channel
  if (channel.ownerId === subscriberId) {
    throw new Error("CANNOT_SUBSCRIBE_OWN_CHANNEL");
  }

  // 3. Check whether the user is already subscribed
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

  // 4. Create subscription
  return prisma.subscription.create({
    data: {
      subscriberId,
      channelId,
    },
  });
};