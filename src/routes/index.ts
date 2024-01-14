import { Router } from 'express';
import authenticate from "../middlewares/authenticate";
import auth from "../routes/auth";
import url from "../routes/url";

const router = Router();

router.use("/auth", auth);
router.use("/url", authenticate, url);

export default router;