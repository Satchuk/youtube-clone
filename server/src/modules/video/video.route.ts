import { Router } from "express";
import { createVideo, deleteVideo, getVideoById, getVideosByChannel, updateVideo } from "./video.controller";
import { createVideoSchema, updateVideoSchema } from "./video.validation";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/auth.middleware";

const videoRouter = Router();

videoRouter.post(
  "/",
  authenticate,
  validate(createVideoSchema),
  createVideo
);
videoRouter.get(
  "/channel/:channelId",
  getVideosByChannel
);
videoRouter.get("/:videoId", getVideoById);
videoRouter.patch(
  "/:videoId",
  authenticate,
  validate(updateVideoSchema),
  updateVideo
);
videoRouter.delete(
  "/:videoId",
  authenticate,
  deleteVideo
);
export default videoRouter;