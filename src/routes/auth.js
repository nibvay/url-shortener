import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";
import CustomError from "../utils/CustomError";

const router = express.Router();
const { JWT_SECRET } = process.env;

router.post("/register", async (req, res, next) => {
  try {
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
      throw new CustomError({ message: "This email has already been registered.", status: 400 });
    }

    const newUser = await User.create(toAddUser);
    res.status(200).json({ message: "User registered successfully", user: newUser });
  } catch (e) {
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new CustomError({ message: "[Unauthorized] Invalid email or password", status: 400 });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new CustomError({ message: "[Unauthorized] Invalid password", status: 400 });

    const accessToken = jwt.sign({ name: user.name, email }, JWT_SECRET, { expiresIn: "24h" });
    const refreshToken = jwt.sign({ name: user.name, email }, JWT_SECRET, { expiresIn: "72h" });
    res.status(200).json({ message: "Login successful", accessToken, refreshToken });
  } catch (e) {
    next(e);
  }
});

router.post("/renew", async (req, res, next) => {
  const { refreshToken } = req.body;
  try {
    const decodedRefreshToken = jwt.verify(refreshToken, JWT_SECRET);
    const user = await User.findOne({ email: decodedRefreshToken.email });
    if (!user) throw new CustomError({ message: "[Unauthorized] Invalid refresh token", status: 400 });

    const accessToken = jwt.sign({ name: decodedRefreshToken.name, email: decodedRefreshToken.email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Renew access token successfully", accessToken });
  } catch (e) {
    next(e);
  }
});

export default router;

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *
 * /auth/login:
 *   post:
 *     summary: Login to service
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       "200":
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *
 * /auth/renew:
 *   post:
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       "200":
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 */
