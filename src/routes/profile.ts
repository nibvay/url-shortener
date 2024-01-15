import { Router } from "express";
import Url from "../models/url";
import User from "../models/user";
import CustomError from "../utils/CustomError";
import { type ExtendedRequest } from "../extendedTypes";

const router = Router();

router.get("/", async (req: ExtendedRequest, res, next) => {
  const { user } = req;
  console.log("test api user", { user });
  try {
    // const userUrlList = await User.find({ userId: user.userId }).populate({
    //   path: "urlList",
    // });
    res.status(200).json({ message: "test ok" });
  } catch (e) {
    next(e);
  }
});

export default router;