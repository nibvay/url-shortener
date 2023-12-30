import express from "express";
import { nanoid } from "nanoid";
import Url from "../models/url.js";
import CustomError from "../utils/CustomError.js";

const router = express.Router();

const BASE_URL = "http://nibvay-url-shorten-project/";

function validUrl(url) {
  if (url.length > 0) return true;
  return false;
}

router.post("/shorten", async (req, res, next) => {
  const { originUrl } = req.body;
  try {
    if (!validUrl(originUrl)) throw new CustomError({ message: "invalid origin url", status: 400 });
    const url = await Url.findOne({ originUrl });
    if (url) {
      res.status(200).json({ urlId: url.shortUrl });
    } else {
      const urlId = nanoid();
      const newUrl = await Url.create({
        originUrl,
        urlId,
        shortUrl: `${BASE_URL}${urlId}`,
        date: Date.now(),
      });
      console.log("newUrl", newUrl);
      res.status(200).json({ url: newUrl });
    }
  } catch (e) {
    next(e);
  }
});

router.get("/:urlId", async (req, res, next) => {
  const { urlId } = req.params;
  try {
    const url = await Url.findOne({ urlId });
    if (!url) throw new CustomError({ message: "url not found", status: 400 });
    const updatedUrl = await Url.findOneAndUpdate(
      { urlId },
      { clickCount: url.clickCount + 1 },
      {
        runValidators: true,
        new: true,
      }
    );
    res.status(200).json({ originUrl: updatedUrl.originUrl, clickCount: updatedUrl.clickCount });
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
 *                 url:
 *                   type: string
 *
 * /url/{urlId}:
 *   get:
 *     summary: Get origin url
 *     parameters:
 *     - in: path
 *       name: urlId
 *       schema:
 *         type: string
 *       required: true
 *     responses:
 *       "200":
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 originUrl:
 *                   type: string
 *                 clickCount:
 *                   type: number
 */
