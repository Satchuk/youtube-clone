import { Router } from "express";
import {
  subscribeToChannel,
  unsubscribeFromChannel,
  getSubscriptionStatus,
  getSubscriberCount,
  getMySubscriptions,
} from "./subscription.controller";

import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

// Get all channels the logged-in user has subscribed to
router.get("/me", authenticate, getMySubscriptions);

// Check whether logged-in user is subscribed to a channel
router.get("/:channelId/status", authenticate, getSubscriptionStatus);

// Get subscriber count for a channel
router.get("/:channelId/count", getSubscriberCount);

// Subscribe to a channel
router.post("/:channelId", authenticate, subscribeToChannel);

// Unsubscribe from a channel
router.delete("/:channelId", authenticate, unsubscribeFromChannel);

export default router;