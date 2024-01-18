import { Router } from "express";
import User from "../models/user";
import CustomError from "../utils/CustomError";
import { type ExtendedRequest } from "../extendedTypes";

const router = Router();

router.get("/", async (req: ExtendedRequest, res, next) => {
  const { user } = req;
  try {
    const userUrlList = await User.findOne({ email: user?.email }).populate({ path: "urlList", });
    res.status(200).json({ userUrlList });
  } catch (e) {
    next(e);
  }
});

export default router;