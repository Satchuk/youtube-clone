import { Request, Response } from "express";
import { createVideoService, deleteVideoService, getVideoByIdService, getVideosByChannelService, updateVideoService } from "./video.service";

export const createVideo = async (
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

    const video = await createVideoService(userId, req.body);

    res.status(201).json({
      success: true,
      message: "Video created successfully",
      video,
    });
  } catch (error) {
    console.error("Create video error:", error);

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
        message: "You are not authorized to upload videos to this channel",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getVideosByChannel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const channelId = req.params.channelId as string;

    const videos = await getVideosByChannelService(channelId);

    res.status(200).json({
      success: true,
      message: "Videos fetched successfully",
      videos,
    });
  } catch (error) {
    console.error("Get videos by channel error:", error);

    if (error instanceof Error && error.message === "CHANNEL_NOT_FOUND") {
      res.status(404).json({
        success: false,
        message: "Channel not found",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getVideoById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const videoId = req.params.videoId as string;

    const video = await getVideoByIdService(videoId);

    res.status(200).json({
      success: true,
      message: "Video fetched successfully",
      video,
    });
  } catch (error) {
    console.error("Get video by ID error:", error);

    if (error instanceof Error && error.message === "VIDEO_NOT_FOUND") {
      res.status(404).json({
        success: false,
        message: "Video not found",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateVideo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const videoId = req.params.videoId as string;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const updatedVideo = await updateVideoService(
      videoId,
      userId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Video updated successfully",
      video: updatedVideo,
    });
  } catch (error) {
    console.error("Update video error:", error);

    if (error instanceof Error && error.message === "VIDEO_NOT_FOUND") {
      res.status(404).json({
        success: false,
        message: "Video not found",
      });
      return;
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      res.status(403).json({
        success: false,
        message: "You are not authorized to update this video",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteVideo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const videoId = req.params.videoId as string;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    await deleteVideoService(videoId, userId);

    res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    console.error("Delete video error:", error);

    if (error instanceof Error && error.message === "VIDEO_NOT_FOUND") {
      res.status(404).json({
        success: false,
        message: "Video not found",
      });
      return;
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      res.status(403).json({
        success: false,
        message: "You are not authorized to delete this video",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};