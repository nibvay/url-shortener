import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import CustomError from "../utils/CustomError.js";

const router = express.Router();
const { JWT_SECRET } = process.env;

// POST /auth/register
// payload: { name, email, password }
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
  
    const newUser = await User.create(toAddUser);
    res.status(200).json({ message: "User registered successfully", user: newUser });
  } catch (e) {
    next(e);
  }
});

// POST /auth/login
// payload: { email, password }
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne(({ email }));
    if (!user) throw new CustomError({ message: "[Unauthorized] Invalid email or password", status: 400 });
  
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new CustomError({ message: "[Unauthorized] Invalid password", status: 400 });

    const accessToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" } );
    const refreshToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "72h" } );
    res.status(200).json({ message: "Login successful", accessToken, refreshToken });
  } catch (e) {
    next(e);
  }
});

// POST /auth/renew
// payload: { refreshToken }
router.post("/renew", async (req, res, next) => {
  const { refreshToken } = req.body;
  try {
    const decodedRefreshToken = jwt.verify(refreshToken, JWT_SECRET);
    const user = await User.findOne(({ email: decodedRefreshToken.email }));
    if (!user) throw new CustomError({ message: "[Unauthorized] Invalid refresh token", status: 400 });

    const accessToken = jwt.sign({ email: decodedRefreshToken.email }, JWT_SECRET, { expiresIn: "1h" } );
    res.status(200).json({ message: "Renew access token successfully", accessToken });
  } catch (e) {
    next(e);
  }
});

export default router;