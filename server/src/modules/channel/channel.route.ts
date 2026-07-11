import { Router } from "express";
import { createChannel, deleteChannel, getChannelByHandle, getMyChannels, updateChannel } from "./channel.controller";
import { createChannelSchema, updateChannelSchema } from "./channel.validation";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/auth.middleware";

const channelRouter = Router();

channelRouter.post(
  "/",
  authenticate,
  validate(createChannelSchema),
  createChannel
);

channelRouter.get(
  "/me",
  authenticate,
  getMyChannels
);
channelRouter.get(
  "/:handle",
  getChannelByHandle
);
channelRouter.patch(
  "/:channelId",
  authenticate,
  validate(updateChannelSchema),
  updateChannel
);
channelRouter.delete(
  "/:channelId",
  authenticate,
  deleteChannel
);

export default channelRouter;