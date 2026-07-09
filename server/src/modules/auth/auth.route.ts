import { Router } from "express";
import { register ,login, getCurrentUser} from "./auth.controller";
import { authenticate, AuthRequest } from "../../middleware/auth.middleware";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", authenticate, getCurrentUser);

export default authRouter;