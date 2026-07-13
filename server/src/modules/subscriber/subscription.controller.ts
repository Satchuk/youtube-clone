import { Request, Response } from "express";
import { subscribeToChannelService } from "./subscription.service";

export const subscribeToChannel = async (
    req: Request,
    res: Response
) => {
    try {
        try {
            const subscriberId = req.user!.userId;
            const channelId = Array.isArray(req.params.channelId)
                ? req.params.channelId[0]
                : req.params.channelId;

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
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};