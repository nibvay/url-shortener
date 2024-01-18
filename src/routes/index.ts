import { Router } from "express";
import authenticate from "middlewares/authenticate";
import auth from "routes/auth";
import url from "routes/url";
import profile from "routes/profile";

const router = Router();

router.use("/auth", auth);
router.use("/url", authenticate, url);
router.use("/profile", authenticate, profile);

export default router;