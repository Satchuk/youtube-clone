import { Router } from "express";
import {
  likeVideo,
  dislikeVideo,
  getVideoReactions,
} from "./reaction.controller";

import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.post("/:videoId/like", authenticate, likeVideo);
router.post("/:videoId/dislike", authenticate, dislikeVideo);
router.get("/:videoId", authenticate, getVideoReactions);

export default router;