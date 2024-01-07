import express from "express";
import passport from "passport";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import cors from "cors";
import "dotenv/config";

import dbConnection from "./config/dbConnection.js";
import errorHandler from "./middlewares/errorHandler.js";
import authenticate from "./middlewares/authenticate.js";
import url from "./routes/url.js";
import redirectUrl from "./routes/redirectUrl.js";
import auth from "./routes/auth.js";

import "./config/passport.js";

const { PORT, CLIENT_PORT } = process.env;

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Express API for JSONPlaceholder",
      version: "1.0.0",
    },
  },
  // Paths to files containing OpenAPI definitions
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

const app = express();
dbConnection();

app.use(cors({ origin: [`http://localhost:${CLIENT_PORT}`] }));
app.use(express.json());

app.use(passport.initialize());

app.use("/health", (req, res) => {
  res.status(200).send({ message: "ok", data: new Date() });
});
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", auth);
app.use("/api/url", authenticate, url);
app.use("/url", redirectUrl);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
