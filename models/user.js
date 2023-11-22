import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
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
  }
});

export default mongoose.model("Users", UserSchema);
