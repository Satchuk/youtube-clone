import prisma from "../../config/prisma";

interface CreateChannelInput {
  name: string;
  handle: string;
  description?: string;
  avatarUrl?: string;
  bannerUrl?: string;
}

interface UpdateChannelInput {
  name?: string;
  handle?: string;
  description?: string;
  avatarUrl?: string;
  bannerUrl?: string;
}

export const createChannelService = async (
  ownerId: string,
  data: CreateChannelInput
) => {
  const channel = await prisma.channel.create({
    data: {
      name: data.name,
      handle: data.handle,
      description: data.description,
      avatarUrl: data.avatarUrl,
      bannerUrl: data.bannerUrl,
      ownerId,
    },
  });

  return channel;
};

export const getMyChannelsService = async (ownerId: string) => {
  const channels = await prisma.channel.findMany({
    where: {
      ownerId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return channels;
};

export const getChannelByHandleService = async (handle: string) => {
  const channel = await prisma.channel.findUnique({
    where: {
      handle,
    },
  });

  return channel;
};

export const updateChannelService = async (
  channelId: string,
  ownerId: string,
  data: UpdateChannelInput
) => {
  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  if (!channel) {
    throw new Error("CHANNEL_NOT_FOUND");
  }

  if (channel.ownerId !== ownerId) {
    throw new Error("FORBIDDEN");
  }

  const updatedChannel = await prisma.channel.update({
    where: {
      id: channelId,
    },
    data,
  });

  return updatedChannel;
};

export const deleteChannelService = async (
  channelId: string,
  ownerId: string
) => {
  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  if (!channel) {
    throw new Error("CHANNEL_NOT_FOUND");
  }

  if (channel.ownerId !== ownerId) {
    throw new Error("FORBIDDEN");
  }

  await prisma.channel.delete({
    where: {
      id: channelId,
    },
  });
};