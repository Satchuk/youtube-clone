import { Router } from "express";
import { register ,login, getCurrentUser,  updateCurrentUser,} from "./auth.controller";
import { authenticate, validate } from "../../middleware/auth.middleware";
import { updateProfileSchema } from "./auth.validation";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", authenticate, getCurrentUser);
authRouter.patch("/me", authenticate, validate(updateProfileSchema), updateCurrentUser);

export default authRouter;