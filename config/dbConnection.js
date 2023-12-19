import mongoose from "mongoose";
import "dotenv/config";

const { CONNECTION_STRING } = process.env;

const dbConnection = async () => {
  try {
    console.log("Database connecting...");
    const connect = await mongoose.connect(CONNECTION_STRING);
    console.log(
      "Database connected: ",
      connect.connection.host,
      connect.connection.name
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export default dbConnection;
