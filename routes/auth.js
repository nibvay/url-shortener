import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import mailTransporter from "../config/nodemailer.js";
import User from "../models/user.js";
import CustomError from "../utils/CustomError.js";
import catchErrors from "../utils/catchError.js";

const router = express.Router();
const { JWT_SECRET, TEST_RECEIVER_MAIL } = process.env;

// POST /auth/register
// payload: { name, email, password }
router.post(
  "/register",
  catchErrors(async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const toAddUser = {
      name,
      password: hashedPassword,
      email,
      creationDate: Date.now(),
    };

    const existedUser = await User.find({ email });
    if (existedUser.length > 0) {
      throw new CustomError({
        message: "This email has already been registered.",
        status: 400,
      });
    }

    const newUser = await User.create(toAddUser);
    if (newUser) {
      await mailTransporter.verify();

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: TEST_RECEIVER_MAIL,
        subject: "Welcome to register URL-SHORTENER service",
        text: `Hello ${name}! Enjoy it.`,
      };

      mailTransporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          res.status.send("Error sending email");
        } else {
          console.log(info);
          res.send("email sent!");
        }
      });
    }

    res
      .status(200)
      .json({ message: "User registered successfully", user: newUser });
  })
);

// POST /auth/login
// payload: { email, password }
router.post(
  "/login",
  catchErrors(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      throw new CustomError({
        message: "[Unauthorized] Invalid email or password",
        status: 400,
      });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      throw new CustomError({
        message: "[Unauthorized] Invalid password",
        status: 400,
      });

    const accessToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "72h" });
    res
      .status(200)
      .json({ message: "Login successful", accessToken, refreshToken });
  })
);

// POST /auth/renew
// payload: { refreshToken }
router.post(
  "/renew",
  catchErrors(async (req, res) => {
    const { refreshToken } = req.body;
    const decodedRefreshToken = jwt.verify(refreshToken, JWT_SECRET);
    const user = await User.findOne({ email: decodedRefreshToken.email });
    if (!user)
      throw new CustomError({
        message: "[Unauthorized] Invalid refresh token",
        status: 400,
      });

    const accessToken = jwt.sign(
      { email: decodedRefreshToken.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res
      .status(200)
      .json({ message: "Renew access token successfully", accessToken });
  })
);

export default router;
