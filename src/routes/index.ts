import { Router } from 'express';
import authenticate from "../middlewares/authenticate";
import auth from "../routes/auth";
import url from "../routes/url";

const router = Router();

router.use("/api/auth", auth);
router.use("/api/url", authenticate, url);

export default router;