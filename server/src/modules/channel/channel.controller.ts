import { Request, Response } from "express";
import { createChannelService ,deleteChannelService,getChannelByHandleService,getMyChannelsService, updateChannelService} from "./channel.service";
import { Prisma } from "@prisma/client";

export const createChannel = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        const channel = await createChannelService(userId, req.body);

        res.status(201).json({
            success: true,
            message: "Channel created successfully",
            channel,
        });
    } catch (error) {
        console.error("Create channel error:", error);

        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            res.status(409).json({
                success: false,
                message: "Channel handle already exists",
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getMyChannels = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const channels = await getMyChannelsService(userId);

    res.status(200).json({
      success: true,
      message: "Channels fetched successfully",
      channels,
    });
  } catch (error) {
    console.error("Get my channels error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getChannelByHandle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const handle = req.params.handle as string;

    const channel = await getChannelByHandleService(handle);

    if (!channel) {
      res.status(404).json({
        success: false,
        message: "Channel not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Channel fetched successfully",
      channel,
    });
  } catch (error) {
    console.error("Get channel by handle error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateChannel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const channelId = req.params.channelId as string;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const updatedChannel = await updateChannelService(
      channelId,
      userId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Channel updated successfully",
      channel: updatedChannel,
    });
  } catch (error) {
    console.error("Update channel error:", error);

    if (error instanceof Error && error.message === "CHANNEL_NOT_FOUND") {
      res.status(404).json({
        success: false,
        message: "Channel not found",
      });
      return;
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      res.status(403).json({
        success: false,
        message: "You are not authorized to update this channel",
      });
      return;
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      res.status(409).json({
        success: false,
        message: "Channel handle already exists",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteChannel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const channelId = req.params.channelId as string;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    await deleteChannelService(channelId, userId);

    res.status(200).json({
      success: true,
      message: "Channel deleted successfully",
    });
  } catch (error) {
    console.error("Delete channel error:", error);

    if (error instanceof Error && error.message === "CHANNEL_NOT_FOUND") {
      res.status(404).json({
        success: false,
        message: "Channel not found",
      });
      return;
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      res.status(403).json({
        success: false,
        message: "You are not authorized to delete this channel",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};