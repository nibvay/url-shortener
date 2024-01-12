import { Schema, model } from "mongoose";

const UrlSchema = new Schema({
  originUrl: {
    type: String,
    required: true,
  },
  urlId: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
  clickCount: {
    type: Number,
    default: 0,
  },
  date: {
    type: String,
    required: true,
    default: Date.now,
  },
});

export default model("Urls", UrlSchema);
