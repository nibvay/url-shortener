import { Schema, Types, model } from "mongoose";

const UserSchema = new Schema({
  userId: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  creationDate: {
    type: String,
    required: true,
    default: Date.now,
  },
  urlList: [
    { type: Types.ObjectId, ref: "Urls" },
  ]
});

export default model("Users", UserSchema);
