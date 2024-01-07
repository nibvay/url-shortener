import express from "express";
import Url from "../models/url.js";
import CustomError from "../utils/CustomError.js";

const router = express.Router();

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
    // res.status(200).json({ originUrl: updatedUrl.originUrl, clickCount: updatedUrl.clickCount });
    return res.redirect(updatedUrl.originUrl);
  } catch (e) {
    next(e);
  }
});
export default router;

/**
 * @swagger
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
