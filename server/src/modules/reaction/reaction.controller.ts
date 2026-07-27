import { Request, Response } from "express";
import {
  reactToVideoService,
  getVideoReactionsService,
} from "./reaction.service";


// ========================================
// LIKE VIDEO
// ========================================

export const likeVideo = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user!.userId;
    const videoId = req.params.videoId as string;

    const reaction = await reactToVideoService(
      userId,
      videoId,
      "LIKE"
    );

    return res.status(200).json({
      success: true,
      message: reaction
        ? "Video liked successfully"
        : "Like removed successfully",
      data: reaction,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "VIDEO_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    console.error("Like video error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ========================================
// DISLIKE VIDEO
// ========================================

export const dislikeVideo = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user!.userId;
    const videoId = req.params.videoId as string;

    const reaction = await reactToVideoService(
      userId,
      videoId,
      "DISLIKE"
    );

    return res.status(200).json({
      success: true,
      message: reaction
        ? "Video disliked successfully"
        : "Dislike removed successfully",
      data: reaction,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "VIDEO_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    console.error("Dislike video error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ========================================
// GET VIDEO REACTIONS
// ========================================

export const getVideoReactions = async (
  req: Request,
  res: Response
) => {
  try {
    const videoId = req.params.videoId as string;

    // User may or may not be authenticated for this endpoint
    const userId = req.user?.userId;

    const reactions = await getVideoReactionsService(
      videoId,
      userId
    );

    return res.status(200).json({
      success: true,
      data: reactions,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "VIDEO_NOT_FOUND") {
      return res.status(404).json({ 
        success: false,
        message: "Video not found",
      });
    }

    console.error("Get video reactions error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

