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

// POST /url/short
// payload: { originUrl }
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

// GET /url/xxxxx
router.get("/:urlId", async (req, res, next) => {
  const { urlId } = req.params;
  try {
    const url = await Url.findOne({ urlId });
    if (!url) throw new CustomError({ message: "url not found", status: 400 });
    const updatedUrl = await Url.findOneAndUpdate({ urlId },
      { clickCount: url.clickCount + 1 },
      { 
        runValidators: true, 
        new: true,
      }
    );
    res.status(200).json({ result: updatedUrl });
  } catch(e) {
    next(e);
  }
});

export default router;