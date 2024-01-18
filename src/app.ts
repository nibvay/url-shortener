import express from "express";
import passport from "passport";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import "dotenv/config";

import dbConnection from "config/dbConnection";
import errorHandler from "middlewares/errorHandler";
import routes from "routes";
import redirectUrl from "routes/redirectUrl";

import "config/passport";
import swaggerDoc from "./swagger.json";

const { PORT, CLIENT_PORT } = process.env;

const app = express();
dbConnection();

app.use(cors({ origin: [`http://localhost:${CLIENT_PORT}`, "https://url-shortener-client-ten.vercel.app"] }));
app.use(express.json());

app.use(passport.initialize());

app.use("/health", (req, res) => {
  res.status(200).send({ message: "ok", data: new Date() });
});
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use("/api", routes);
app.use("/url", redirectUrl);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
