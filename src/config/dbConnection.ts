import mongoose from "mongoose";
import "dotenv/config";
import CustomError from "../utils/CustomError";

const { MONGODB_URI } = process.env;

const dbConnection = async () => {
  try {
    console.log("Database connecting...");
    if (typeof MONGODB_URI !== 'string') {
      throw new CustomError({ message: "invalid db uri", status: 500 });
    }
    const connect = await mongoose.connect(MONGODB_URI);
    console.log("Database connected: ", connect.connection.host, connect.connection.name);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export default dbConnection;
