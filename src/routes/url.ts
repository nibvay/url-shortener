import { Router } from "express";
import { nanoid } from "nanoid";
import Url from "models/url";
import User from "models/user";
import CustomError from "utils/CustomError";
import { type ExtendedRequest } from "types/extendedTypes";

const router = Router();
const { PROCESS_MODE, PORT } = process.env;

const BASE_URL =
  PROCESS_MODE === "production" ? "https://url-shortener-six-gilt.vercel.app/url/" : `http://localhost:${PORT}/url/`;

function isValidUrl(url: string) {
  try {
    return Boolean(new URL(url));
  } catch (e) {
    return false;
  }
}

// 1. push current new url to user urlList
// 2. add new shorten url
router.post("/shorten", async (req: ExtendedRequest, res, next) => {
  const { originUrl } = req.body;
  const { user } = req;
  try {
    if (!isValidUrl(originUrl)) throw new CustomError({ message: "invalid origin url", status: 400 });

    const existedUrl = await Url.findOne({ originUrl });
    if (existedUrl) {
      res.status(200).json({ urlId: existedUrl.shortUrl });
      return;
    }

    // 1. add new shorten url
    const urlId = nanoid();
    const newUrl = {
      originUrl,
      urlId,
      shortUrl: `${BASE_URL}${urlId}`,
      date: Date.now(),
    };
    const createdUrl = await Url.create(newUrl);

    // 2. push new url to user urlList
    await User.findOneAndUpdate(
      { email: user?.email },
      { $push: { urlList: createdUrl._id } },
      { returnNewDocument: true }
    );

    res.status(200).json({ shortUrl: createdUrl.shortUrl });
  } catch (e) {
    next(e);
  }
});

export default router;

/**
 * @swagger
 * /url/shorten:
 *   post:
 *     summary: Create shorten url
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               originUrl:
 *                 type: string
 *     responses:
 *       "200":
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *
 */
