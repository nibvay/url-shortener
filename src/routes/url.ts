import { Router } from "express";
import { nanoid } from "nanoid";
import Url from "../models/url";
import CustomError from "../utils/CustomError";

const router = Router();
const { PROCESS_MODE, PORT } = process.env;

const BASE_URL =
  PROCESS_MODE === "production" ? "https://url-shortener-six-gilt.vercel.app/url/" : `http://localhost:${PORT}/url/`;

export function isValidUrl(url: string) {
  try {
    return Boolean(new URL(url));
  } catch (e) {
    return false;
  }
}

router.post("/shorten", async (req, res, next) => {
  const { originUrl } = req.body;
  try {
    if (!isValidUrl(originUrl)) throw new CustomError({ message: "invalid origin url", status: 400 });
    const url = await Url.findOne({ originUrl });
    if (url) {
      res.status(200).json({ urlId: url.shortUrl });
    } else {
      const urlId = nanoid();
      const { shortUrl } = await Url.create({
        originUrl,
        urlId,
        shortUrl: `${BASE_URL}${urlId}`,
        date: Date.now(),
      });

      res.status(200).json({ shortUrl });
    }
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
