import { Request, Response } from "express";

import {
  subscribeToChannelService,
  unsubscribeFromChannelService,
  getSubscriptionStatusService,
  getSubscriberCountService,
  getMySubscriptionsService,
} from "./subscription.service";


// ========================================
// SUBSCRIBE TO CHANNEL
// ========================================

export const subscribeToChannel = async (
  req: Request,
  res: Response
) => {
  try {
    const subscriberId = req.user!.userId;
    const channelId = req.params.channelId as string;

    const subscription = await subscribeToChannelService(
      subscriberId,
      channelId
    );

    return res.status(201).json({
      success: true,
      message: "Subscribed successfully",
      data: subscription,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "CHANNEL_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Channel not found",
        });
      }

      if (error.message === "CANNOT_SUBSCRIBE_OWN_CHANNEL") {
        return res.status(400).json({
          success: false,
          message: "You cannot subscribe to your own channel",
        });
      }

      if (error.message === "ALREADY_SUBSCRIBED") {
        return res.status(409).json({
          success: false,
          message: "Already subscribed to this channel",
        });
      }
    }

    console.error("Subscribe to channel error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ========================================
// UNSUBSCRIBE FROM CHANNEL
// ========================================

export const unsubscribeFromChannel = async (
  req: Request,
  res: Response
) => {
  try {
    const subscriberId = req.user!.userId;
    const channelId = req.params.channelId as string;

    await unsubscribeFromChannelService(subscriberId, channelId);

    return res.status(200).json({
      success: true,
      message: "Unsubscribed successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_SUBSCRIBED") {
      return res.status(404).json({
        success: false,
        message: "You are not subscribed to this channel",
      });
    }

    console.error("Unsubscribe from channel error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ========================================
// CHECK SUBSCRIPTION STATUS
// ========================================

export const getSubscriptionStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const subscriberId = req.user!.userId;
    const channelId = req.params.channelId as string;

    const result = await getSubscriptionStatusService(
      subscriberId,
      channelId
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "CHANNEL_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    console.error("Get subscription status error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ========================================
// GET SUBSCRIBER COUNT
// ========================================

export const getSubscriberCount = async (
  req: Request,
  res: Response
) => {
  try {
    const channelId = req.params.channelId as string;

    const result = await getSubscriberCountService(channelId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "CHANNEL_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    console.error("Get subscriber count error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ========================================
// GET MY SUBSCRIBED CHANNELS
// ========================================

export const getMySubscriptions = async (
  req: Request,
  res: Response
) => {
  try {
    const subscriberId = req.user!.userId;

    const subscriptions = await getMySubscriptionsService(subscriberId);

    return res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    console.error("Get my subscriptions error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};