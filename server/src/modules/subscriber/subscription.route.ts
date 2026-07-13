import { Router } from "express";
import { subscribeToChannel } from "./subscription.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.post("/:channelId", authenticate, subscribeToChannel);

export default router;