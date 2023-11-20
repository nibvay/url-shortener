import express from "express";
import "dotenv/config";
import dbConnection from "../config/dbConnection.js";
import url from "../routes/url.js";

const { PORT } = process.env;

const app = express();
dbConnection();

app.use(express.json());
app.use("/url", url);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});