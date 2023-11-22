import express from "express";
import "dotenv/config";
import passport from "passport";
import dbConnection from "./config/dbConnection.js";
import errorHandler from "./middlewares/errorHandler.js";
import authenticate from "./middlewares/authenticate.js";
import url from "./routes/url.js";
import auth from "./routes/auth.js";

import "./config/passport.js";

const { PORT } = process.env;

const app = express();
dbConnection();

app.use(express.json());

app.use(passport.initialize());

app.use("/auth", auth);
app.use("/url", authenticate, url);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});