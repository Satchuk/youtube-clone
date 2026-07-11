import express, { Request, Response } from "express";
import cors from "cors";
import authRouter from "./modules/auth/auth.route";
import channelRouter from "./modules/channel/channel.route";
import videoRouter from "./modules/video/video.route";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "YouTube Clone API is running 🚀",
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/channels", channelRouter);
app.use("/api/v1/videos", videoRouter);


export default app;