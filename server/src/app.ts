import express, { Request, Response } from "express";
import cors from "cors";
import authRouter from "./modules/auth/auth.route";

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

export default app;