import express from "express";
import { nanoid } from "nanoid";
import Url from "../models/url.js";

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

  if (!validUrl(originUrl)) {
    res.status(400).json({ error: "invalid origin url" });
    return next(new Error("invalid url"));
  }

  const url = await Url.findOne({ originUrl });
  console.log("find", url);
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
});

// GET /url/xxxxx
router.get("/:urlId", async (req, res, next) => {
  const { urlId } = req.params;
  const url = await Url.findOne({ urlId });
  if (url) {
    const updatedUrl = await Url.findOneAndUpdate({ urlId },
      { clickCount: url.clickCount + 1 },
      { 
        runValidators: true, 
        new: true,
      }
    );
    res.status(200).json({ result: updatedUrl });
  } else {
    res.status(404).json({ result: "not fount" });
  }
});

export default router;